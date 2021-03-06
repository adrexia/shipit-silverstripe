var utils = require('shipit-utils');
var chalk = require('chalk');
var init = require('../../lib/init');

/**
 * runs a dev/build process on the current release
 */

module.exports = function (gruntOrShipit) {

  var task = function() {
    var shipit = utils.getShipit(gruntOrShipit);
    var server = shipit.config.servers.split('@');
    var host = server.length > 1 ? server[1] : server[0];
    shipit = init(shipit);

    shipit.log('Running - dev/build');
    return devbuild()
    .then(function () {
      shipit.log('Running - flush');
      return flush()
    });

    /**
     * Run dev/build on current release path.
     */
    function devbuild() {
      return shipit.remote('cd '+ shipit.currentPath +' && php framework/cli-script.php dev/build && rm -R ./silverstripe-cache/*')
      .then(function () {
        shipit.log(chalk.green('Complete - dev/build'));
      });
    }

    /**
     * Run flush on current host.
     */
    function flush() {
      return shipit.remote('curl http://'+host+'/?flush=all&env_type=dev')
      .then(function () {
        shipit.log(chalk.green('Complete - flush'));
      });
    }
  }

  utils.registerTask(gruntOrShipit, 'silverstripe:devbuild', task, true);

};
