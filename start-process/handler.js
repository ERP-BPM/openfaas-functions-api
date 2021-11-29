'use strict'

const zb = require('zeebe-node');
const { notifyPrivateInsurance, notifyInsuranceActivity, notifyPatientComesActivity, changePatientInitialActivity, assignBedActivity, notifyDoctorActivity, labStudiesActivity, resultsRegisterActivity, notifyDischargeActivity } = require('./workers');



module.exports = async (event, context) => {
  /*const result = {
    'body': JSON.stringify(event.data),
    'content-type': event.headers["content-type"]
  }*/

  console.log(event.body)

  const { username, password } = event.headers

  //console.log(`User and ${username}  ${password}`)

  const method = event.method;
  //const { data, zeebe_credentials } = event.body
  const payload = event.body

  console.log(JSON.stringify(payload))

  //return context.status(200).succeed(payload)

  console.log(`Payload ${JSON.stringify(payload.id)}`)
  /**
   * Only POST requests
   */
  switch (method) {
    case 'POST':

      const zbc = new zb.ZBClient('http://5.161.52.247:26500', { "basicAuth": { username: username, password: password }, useTLS: false }, { loglevel: 'INFO' });
      //const orderid = uuid.v4()

      // DECLARATION OF ANY PROCESS:

    
      zbc.createWorker(
        {
          taskType: 'notify_patient_comes_activity',
          taskHandler: notifyPatientComesActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'change_patient_initial_activity',
          taskHandler: changePatientInitialActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'notify_insure_activity',
          taskHandler: notifyInsuranceActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'notify_private_insurance',
          taskHandler: notifyPrivateInsurance,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'assign_bed_activity',
          taskHandler: assignBedActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'notify_doctor_activity',
          taskHandler: notifyDoctorActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'lab_studies_activity',
          taskHandler: labStudiesActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'results_register_activity',
          taskHandler: resultsRegisterActivity,
        }
      );
    
      zbc.createWorker(
        {
          taskType: 'notify_discharge_activity',
          taskHandler: notifyDischargeActivity,
        }
      );
    
    
/*
      zbc.createWorker(
        {
          taskType: 'actiivty-task',
          taskHandler: patientComesActivity *//*job => {
            const { key, variables } = job;
            console.info(`* Starting Activity...: ${variables}`);
            //const stock = 100; //Aqui se revisa el stock con una request
            job.complete({ variables: variables, sucess: true });
            console.info(`* Passing to next task: ${variables}`);
          }*/
        //});

      //const newsbc = zbc.createBatchWorker(zbc);
      const data = payload.event.data.new
      const wfi = await zbc.createProcessInstance("hospital_process", { workflow_id: data.id_paciente, data: data });
      //wfi.orderid = orderid;
      return context.succeed({ res: payload, wfi });
      break;
    default:
      return context.status(405).succeed({ message: "Only POST" });
      break;
  }
}

