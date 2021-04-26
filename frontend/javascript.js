let hamsters;

async function start() {
	try {
		await fetch('https://worldwarhamsters.herokuapp.com/hamsters')
		  .then(response => response.json())
		  .then(data => doSomething(data));
		
	} catch (error) {
		console.log(error)
	}
	function doSomething(data) {
		hamsters = data;
	}
	hamsters.forEach(hamster => {
		
		const hamsterTag = document.querySelector('#hamsters');
		const h3tag = document.createElement('h3');
		const liTag = document.createElement('li');
		const imgTag = document.createElement('img');
		const pTag = document.createElement('p');
		h3tag.innerText = `<<< ${hamster.name} >>>`
		pTag.innerText = `Han älskar att ${hamster.loves}.`
		imgTag.src = `https://worldwarhamsters.herokuapp.com/img/${hamster.imgName}`
		liTag.appendChild(h3tag);
		liTag.appendChild(pTag);
		liTag.appendChild(imgTag);
		hamsterTag.appendChild(liTag);
		
	});
}
start();