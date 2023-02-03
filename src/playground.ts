import fetch from 'node-fetch';
import prompt from 'prompt-sync';

const search = async (query: string) => {
    const url = 'http://localhost:8000/v1/search';
    const data = {
        vault_id: 'paul',
        query,
    };
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((response) => {
        return response.json();
    }).then((data) => {
        console.log('Success:', data);
    }).catch((error) => {
        console.error('Error:', error);
    });
};

const p = prompt();

// this is an interactive terminal that let you search in paul graham
// blog posts using semantic search
// It is an infinite loop that will ask you for a query
// and show you the results
const start = async () => {
    console.log('Welcome to the Embedbase playground!');
    console.log('This is an interactive terminal that let you search in paul graham blog posts using semantic search');
    console.log('Try to run some queries such as how to have start-up ideas');
    console.log('or how to write a good essay');
    while (true) {
        const query = p('Enter a semantic query:');
        if (!query) {
            console.log('Bye!');
            return;
        }
        await search(query);
    }
};

start();
