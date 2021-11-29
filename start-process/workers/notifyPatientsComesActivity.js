
  const { sendEmail } = require('./../utils')

  module.exports.notifyPatientComesActivity = async (job) => {
  const { variables } = job;
  console.log(JSON.stringify(variables))

  await sendEmail({
    to: variables.data.email, //'a258177@alumnos.uaslp.mx',
    subject: 'Ingreso al Hospital',
    //text: 'Bienvenido a la clinica XXXX- XXX',
    html: `<h1>Bienvenido estimado ${variables.data.nombre} ${variables.data.apellido_paterno} ${variables.data.apellido_materno} </h1>
    <br><p>Su ID de paciente es el siguiente: <strong>${variables.workflow_id}<strong></p>
    <br><p>Éste será el medio por que nos comunicaremos con Ud<p>
    <br><p>Saludos cordiales. Hospital XXXXX</p>
    `,
  }) 


  console.info(`* Starting patientComesActivity...: ${variables}`);
  job.complete({success: true});
}

