import { Command } from "commander";
const program = new Command();

program
    .option("-n, --name <name>", "Contract Name");

program.parse(process.argv);

const options = program.opts();
