function UserLogs(log, user){
  this.user = user;
  this.log = log;
  this.date = new Date ();
}


module.exports = {
  UserLogs: UserLogs
};
