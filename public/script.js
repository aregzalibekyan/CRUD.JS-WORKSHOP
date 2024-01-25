function sendData() {
  const [name, age,email] = [
    document.getElementById("name"),document.getElementById("age"),document.getElementById('email')
  ];

    fetch("http://localhost:3000/addInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ surname: name.value, age: age.value,email:email.value}),
  });
  
  
};
