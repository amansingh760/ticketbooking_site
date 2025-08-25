function sendMail(){
    var params={
      name: document.getElementById("name").value,
  email : document.getElementById("email").value,
  date : document.getElementById("date").value ,
  child :document.getElementById("child").value,
  adult :document.getElementById("adult").value ,
  time :selectedTime
    };
const service_id = "service_wiq3snm";
const template_id="template_7r6rwup" ;
emailjs
.send(service_id,template_id,params)
.then((res)=>{
  const params = new URLSearchParams({
          name, email, date, time: selectedTime,
          child, adult, payment_id: response.razorpay_payment_id
        });
        window.location.href = "tic.html?" + params.toString();
  
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("date").value = "";
  document.getElementById("child").value = "";
  document.getElementById("adult").value = "";
  selectedTime = "";
  console.log(res);
  alert("email send successfully");

})
.catch((err)=>console.log(err));
alert("mail not send");
}