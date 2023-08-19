async function getReport(){
    const token = localStorage.getItem("id");
    const res = await axios.get(`http://localhost:3000/expense/get-report`, {
      headers: { Authorization: token },
    });
    // clearList('table-body');
    for (let i = 0; i < res.data.reportDetails.length; i++) {
      console.log(res.data.reportDetails[i]);
      showDataOnScreen(res.data.reportDetails[i]);
    }
  }

  function showDataOnScreen(data) {
    const parentElement = document.getElementById("table-body");
    const childElement = `<tr id=${data.id}><td>${data.createdAt.slice(0,10)}</td><td>${data.description}</td><td>${data.category}</td><td>${data.price}</td></tr>`
    parentElement.innerHTML += childElement;
  }

  getReport()