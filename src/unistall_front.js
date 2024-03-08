var Service = require('node-windows').Service;
// Criando um novo objeto do serviço
var svc = new Service({
    //Nome do servico
    name: 'MigracaoSQL-Front',
    //Descricao que vai aparecer no Gerenciamento de serviço do Windows
    description: 'Front do Mapeamento do HomePar',
    //caminho absoluto do seu script
    script: 'C:\\Projetos\\fabio.garbato\\MapeadorObjetosDelphiFront\\src\\App.js'
});
svc.on('uninstall', function () {
    console.log('Uninstall complete.');
});
// Desistalar serviço.
svc.uninstall();