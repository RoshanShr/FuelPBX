//users add edit delete is done here
import {
    AppDataSource
} from '../config/database.js';
import 'dotenv/config';
import Extension from '../models/extensionModel.js';
import Client from '../models/clientModel.js';
import path from 'path';
import fs from 'fs/promises'; // Use the promises API of fs for async/await
import {
    exec
} from 'child_process';

export const writeDialplan = async (req, res) => {

    try {
        var clientsList = [];
        const clientsData = await AppDataSource
            .getRepository(Client)
            .createQueryBuilder("client")
            .getMany()

        clientsData.forEach(function (element, index) {
            clientsList[index] = {
                alias: element.alias
            };
        });

        const extensionData = await AppDataSource
            .getRepository(Extension)
            .createQueryBuilder("extension")
            .leftJoinAndSelect("extension.organization", "user") // Adjust table and relation names
            .getMany()


        // clientsList.forEach((cld, key) => {
        //     extensionData.forEach((ext, k) => {
        //         if (ext.organization.alias === cld.alias) {
        //             // If the client matches, add the extension to the client
        //             if (!clientsList[key].extensions) {
        //                 clientsList[key].extensions = []; // Initialize extensions if not already
        //             }
        //             clientsList[key].extensions.push(ext); // Push extension instead of setting by index
        //         }
        //     });
        // });

        const extensionMap = new Map();

        // Group extensions by alias
        extensionData.forEach(ext => {
            const alias = ext.organization.alias;
            if (!extensionMap.has(alias)) {
                extensionMap.set(alias, []);
            }
            extensionMap.get(alias).push(ext);
        });

        // Add grouped extensions to their corresponding clients
        clientsList.forEach(client => {
            client.extensions = extensionMap.get(client.alias) || []; // Default to an empty array if no match
            return client.extensions.length > 0; // Keep only clients with non-empty extensions
        });

        let dialplan = "#include trunks_custom.conf\n\n";

        clientsList.forEach((tr, kr) => {
            if (tr.extensions != undefined) {
                let clientAlias = tr.alias;
                let tableName = clientAlias.replace(/ /g, "_");
                dialplan += `[${clientAlias}]\n`;

                if (clientAlias === 'Bridge International') {
                    dialplan += `include => bridgeint\n`;
                } else {
                    dialplan += `include => ${clientAlias}\n`;
                }

                const callfile = '${CALLERID(num)}-to-${EXTEN}-${STRFTIME(${EPOCH},,%Y%m%d-%H%M%S)}';
                const callfileName = '${CALLFILENAME}';
                const recording = `${callfileName}.wav`;
                const insert = '${ODBC_INTERNAL_CALL_INSERT("Internal",${CALLERID(num)}';
                const update = '${ODBC_INTERNAL_CALL_UPDATE(${LAST_ID},${DIALEDPEERNUMBER}';
                const failed = '${ODBC_INTERNAL_CALL_UPDATE(${LAST_ID},${DIALEDPEERNUMBER},${DIALSTATUS},' + tableName + ')}';
                const goTo = '"${DIALSTATUS}" = "ANSWER"';
                const odbcId = '${ODBC_GET_LAST_INSERT_ID()}';
                const lastId = '${LAST_ID}';


                tr.extensions.forEach((v, k) => {
                    let agentName = `${v.extension}_${v.organization.alias}`;
                    let extension = v.extension;

                    dialplan += `exten => ${extension},1,NoOp(Logging internal call details)\n`;
                    dialplan += `exten => ${extension},n,Set(CALLFILENAME=${callfile})\n`;
                    dialplan += `exten => ${extension},n,MixMonitor(/var/spool/asterisk/monitor/${clientAlias}/${callfileName}.wav,b)\n`;
                    dialplan += `exten => ${extension},n,Set(ODBC_Result=${insert},${extension},${tableName}, ${recording})})\n`;
                    dialplan += `exten => ${extension},n,Set(LAST_ID=${odbcId})\n`;
                    dialplan += `exten => ${extension},n,NoOp(ODBC ID:${lastId})\n`;
                    dialplan += `exten => ${extension},n,Dial(SIP/${agentName},,g)\n`;

                    dialplan += `exten => ${extension},n,GotoIf($[${goTo}]?answered:failed)\n`;

                    dialplan += `exten => ${extension},n(answered),Set(ODBC_RESULT=${update},ANSWERED,${tableName})})\n`;
                    dialplan += `exten => ${extension},n,Hangup()\n`;

                    dialplan += `exten => ${extension},n(failed),Set(ODBC_RESULT= ${failed})\n`;
                    dialplan += `exten => ${extension},n,Hangup()\n`;
                    dialplan += '\n';

                    dialplan += `exten => h,1,GotoIf($[${goTo}]?answered:failed)\n`;

                    dialplan += `exten => h,n(answered),Set(ODBC_RESULT=${update},ANSWERED,${tableName})})\n`;
                    dialplan += `exten => h,n,Return()\n`;

                    dialplan += `exten => h,n(failed),Set(ODBC_RESULT= ${failed})\n`;
                    dialplan += `exten => h,n,Return()\n\n`;

                });
            }
        });


        const filePath = '/etc/asterisk/extensions.conf'; // Update the path as per your requirements


        // Write the dialplan file
        await fs.writeFile(filePath, dialplan);
        console.log("Dialplan updated successfully!");

        // Write agents after updating the dialplan
        const result = await writeAgents(clientsList);
        res.status(200).send(dialplan);

    } catch (err) {
        console.error('Error in writing dialplan:', err);
        res.status(500).send('Dialplan error'); // Handle errors appropriately
    }


}

async function writeAgents(clientList) {
    let dialplan = '';
    clientList.forEach((tr) => {
        if (tr.extensions != undefined) {
            tr.extensions.forEach((v) => {
                const extension = v.extension;
                const alias = v.organization.alias;
                const pwd = v.password;

                dialplan += `[${extension}_${alias}]\n`;
                dialplan += `type=friend\n`;
                dialplan += `context => ${alias}\n`;
                dialplan += `secret => ${pwd}\n`;
                dialplan += `host => dynamic\n`;
                dialplan += `qualify=yes\n\n`;
            });
        }
    });


    const filePath = '/etc/asterisk/extensions_custom.conf';
    try {
        await fs.writeFile(filePath, dialplan);
        coreReload()
        console.log("Dialplan agents updated successfully!");
        return "Dialplan agents updated successfully!";
    } catch (err) {
        console.error(`Failed to write to ${filePath}:`, err);
        throw new Error(`Failed to write agents: ${err.message}`);
    }
}

function coreReload() {
    const command = "sudo /usr/sbin/asterisk -rx 'core reload'";
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
}