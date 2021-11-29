'use strict'
const zb = require("zeebe-node");
const uuid = require("uuid");



module.exports = async (event, context) => {
  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }

  const { username, password } = event.headers

  //console.log(`User and ${username}  ${password}`)

  const method = event.method;

  console.log(event.body)

  //return context.succeed(event.body)
  const  payload   = event.body
  //console.log(`Payload ${JSON.stringify(payload.id)}`)

  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':
  

      const { message_name, workflow_id, message } = payload;

      const zbc = new zb.ZBClient('http://5.161.52.247:26500', { "basicAuth": { username: username, password: password }, useTLS: false }, { loglevel: 'INFO' });

      console.log(workflow_id)
      //variables.status = 'PROCESSED'
      const res = await zbc.publishMessage({
        correlationKey: workflow_id,
        messageId: uuid.v4(),
        name: message_name,
        variables: message,
        timeToLive: zb.Duration.seconds.of(1), // seconds
      });

      return context.succeed({ success: true, result: res });
    default:
      return context.status(405).succeed({ succes: false });
  }
}

