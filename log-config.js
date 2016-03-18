var log = require('node-simple-log');
log.config('defaultTemplate', '[{time}] [{parent}] [{file-line}]: {arguments}');
log.config('warnTemplate', '[{time}] [{parent}] [{file-line}]: {arguments}');
log.config('errorTemplate', '[{time}] [{parent}] [{file-line}]: {arguments}');
log.config('myLogTemplate', '{time} {ref-file-line} | {arguments}');
exports.log = log;