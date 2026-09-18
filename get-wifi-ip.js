const { execSync } = require('child_process');

// Pergunta pro Windows (via powershell.exe) qual é o IP da interface Wi-Fi
const comando = `powershell.exe -Command "(Get-NetIPAddress -InterfaceAlias 'Wi-Fi 2' -AddressFamily IPv4).IPAddress"`;

try {
  const ip = execSync(comando).toString().trim();
  console.log(ip);
} catch (erro) {
  console.error('Não foi possível detectar o IP da Wi-Fi automaticamente.');
  process.exit(1);
}
