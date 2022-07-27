async function enterSystem(email, password) {
  const res = await axios.default.post("localhost:8000/api/users/signin", {
    data: {
      email: email,
      password: password,
    },
  });
  console.log(res.data);
}

document.querySelector(".form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  enterSystem(email, password);
});
