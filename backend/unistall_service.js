var Service = require('node-windows').Service;
// Criando um novo objeto do serviço
var svc = new Service({
    //Nome do servico
    name: 'MigracaoSQL',
    //Descricao que vai aparecer no Gerenciamento de serviço do Windows
    description: 'Serviço do Mapeamento do HomePar',
    //caminho absoluto do seu script
    script: 'C:\\Projetos\\fabio.garbato\\MapeadorObjetosDelphiFront\\backend\\servidor.js'
});
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
});
// Desistalar serviço.
svc.uninstall();