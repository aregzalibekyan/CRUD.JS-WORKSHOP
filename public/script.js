function as() {
  const name = document.getElementById("name");
  console.log(name.value);
}
function sendData() {
  const [name,age] = [document.getElementById("name"),document.getElementById("age")];
  
  fetch("http://localhost:3000/addInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ surname: name.value, age: age.value }),
  });
}
