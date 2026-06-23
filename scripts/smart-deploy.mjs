import { execSync } from "node:child_process";

console.log("🔍 Calculando o Fingerprint do projeto...");

const parseSafeJSON = (output) => {
	try {
		const match = output.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
		return JSON.parse(match ? match[0] : output);
	} catch {
		console.error(
			"\n❌ Falha ao ler o JSON. Saída original recebida:\n",
			output,
		);
		throw new Error("Não foi possível processar a resposta do EAS.");
	}
};

try {
	const fingerprintOutput = execSync("npx @expo/fingerprint .", {
		encoding: "utf-8",
	});
	const currentHash = parseSafeJSON(fingerprintOutput).hash;

	console.log(`✅ Hash atual: ${currentHash}`);
	console.log("📡 Buscando builds finalizados no EAS...");

	const buildsOutput = execSync(
		"eas build:list --platform=android --profile=preview --status=finished --limit=10 --json",
		{
			encoding: "utf-8",
			env: {
				...process.env,
				CI: "1",
			},
		},
	);
	const builds = parseSafeJSON(buildsOutput);

	const buildExists = builds.some(
		(build) => build.message === `Fingerprint: ${currentHash}`,
	);

	if (buildExists) {
		console.log("🚀 O código nativo NÃO mudou!");
		console.log("Disparando OTA Update rápido (JavaScript apenas)...");

		execSync(
			`eas update --branch preview --environment preview --platform android --message "Update automático (Fingerprint: ${fingerprint})"`,
			{
				stdio: "inherit",
				env: {
					...process.env,
					CI: "1",
				},
			},
		);
	} else {
		console.log("🏗️ O código nativo MUDOU (Nova lib ou config)!");
		console.log("Iniciando a geração de um novo APK...");

		execSync(
			`eas build --platform android --profile preview --message "Fingerprint: ${currentHash}"`,
			{
				stdio: "inherit",
				env: {
					...process.env,
					CI: "1",
				},
			},
		);
	}
} catch (error) {
	console.error(
		"❌ Erro durante o processo de deploy inteligente:",
		error.message,
	);
	process.exit(1);
}
