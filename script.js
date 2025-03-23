document.addEventListener('DOMContentLoaded', function() {
	const container = document.getElementById('image-captcha');
	const images = document.querySelectorAll('#image-captcha .captcha-image');
	const verifyBtn = document.getElementById('verify-btn');
	const resetBtn = document.getElementById('reset-btn');
	const discordBtn = document.getElementById('discord-btn');
	const message = document.getElementById('message');
	
	// Replace with your actual Discord webhook URL
	const discordWebhookUrl = 'https://discord.com/api/webhooks/your_webhook_url';
	
	// Function to shuffle the images order in the container
	function shuffleImages() {
		const imgsArray = Array.from(images);
		for (let i = imgsArray.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[imgsArray[i], imgsArray[j]] = [imgsArray[j], imgsArray[i]];
		}
		container.innerHTML = '';
		imgsArray.forEach(img => container.appendChild(img));
	}
	
	// Toggle selection on image click
	images.forEach(img => {
		img.addEventListener('click', function() {
			img.classList.toggle('selected');
		});
	});
	
	// Validate captcha selection
	verifyBtn.addEventListener('click', function() {
		let allValid = true;
		images.forEach(img => {
			const isSelected = img.classList.contains('selected');
			const isValid = img.getAttribute('data-valid') === 'true';
			if ((isValid && !isSelected) || (!isValid && isSelected)) {
				allValid = false;
			}
		});
		if (allValid) {
			message.textContent = "Captcha Verified!";
			verifyBtn.style.display = 'none';
			discordBtn.style.display = 'inline-block';
		} else {
			message.textContent = "Captcha failed. Please try again.";
			resetBtn.style.display = 'inline-block';
		}
	});
	
	// Reset captcha state and randomly swap image positions
	resetBtn.addEventListener('click', function() {
		images.forEach(img => img.classList.remove('selected'));
		message.textContent = "";
		verifyBtn.style.display = 'inline-block';
		resetBtn.style.display = 'none';
		discordBtn.style.display = 'none';
		shuffleImages();
	});
	
	// Automatically shuffle images on page load
	shuffleImages();
	
	// Send verification result to Discord
	discordBtn.addEventListener('click', function() {
		fetch(discordWebhookUrl, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content: "Captcha verified on HCaptha!" })
		})
		.then(() => {
			message.textContent = "Result sent to Discord!";
			discordBtn.style.display = 'none';
		})
		.catch(() => {
			message.textContent = "Failed to send to Discord.";
		});
	});
});
