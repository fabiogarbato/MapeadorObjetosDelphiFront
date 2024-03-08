var Service = require('node-windows').Service;
// Criando um novo objeto do serviço
var svc = new Service({
    //Nome do servico
    name: 'MigracaoSQL',
    //Descricao que vai aparecer no Gerenciamento de serviço do Windows
    description: 'Serviço do Mapeamento do HomePar',
    //caminho absoluto do seu script
    script: 'C:\\Projetos\\fabio.garbato\\MapeadorObjetosDelphiFront\\backend\\servidor.js',
    env: [{
        name: "NODE_ENV",
        value: "production" // service is now able to access the user who created its' home directory
    },
	{
		name:"port",
		value:"4444"
	}]//,
    //allowServiceLogon: true
});
svc.logOnAs.domain = '.';
svc.logOnAs.account = '';
svc.logOnAs.password = '';
// Verifica se já esta instalada
svc.on('alreadyinstalled', function () {
    console.log(`${svc.name} já foi instalado.`);
});

svc.on('install', function () {
    svc.start();
});
// instalando o servico
svc.install();