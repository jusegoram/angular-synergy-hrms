function UserLogs(log){
  this.log = log;
  this.date = new Date ();
  return this;
}

answer = UserLogs('Logged In');
console.log(answer);