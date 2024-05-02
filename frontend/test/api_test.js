
fetch('http://localhost:8000/query/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "question": "What is the capital of France?",
        "context": "France is a country located in Western Europe..."
    })
})
    .then(res => {
        if(res.ok) {
            console.log('SUCCESS')
        } else {
            console.log("NOT SUCCESS")
        }
        res.json().then(data => console.log(data))
    })
    .catch(error => console.log(error))
    