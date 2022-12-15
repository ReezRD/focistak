const url = "http://localhost:3000/players"

async function playerAppend() {
    let player = {
        name: document.getElementById("name").value,
        qualification: document.getElementById("qualification").value,
        position: document.getElementById("position").value,
        club: document.getElementById("club").value,
        age: document.getElementById("age").value,
        nationality: document.getElementById("nationality").value,
    }

    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(player)
    });

    let data = await response.json();
    console.log(data);
}


function testDateToForm() {
    document.getElementById("name").value = "Ronaldinho"
    document.getElementById("qualification").value = "8"
    document.getElementById("position").value = "csatár"
    document.getElementById("club").value = "Barcelona"
    document.getElementById("age").value = "42"
    document.getElementById("nationality").value = "Brazil"
}

testDateToForm();