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
		
		const hamsterTag = document.querySelector('#hamsters')
		const liTag = document.createElement('li');
		const imgTag = document.createElement('img');
		liTag.innerHTML = `This name is ${hamster.name} and he loves ${hamster.loves}`
		imgTag.src = `https://worldwarhamsters.herokuapp.com/img/${hamster.imgName}`
		liTag.appendChild(imgTag);
		hamsterTag.appendChild(liTag);
		
	});
}
start();