let input = document.getElementById('question')
let counter = document.getElementById('char-count')
let container = document.querySelector('.char-counter')

input.addEventListener('input', function(event) {
let length = event.target.value.length
counter.innerText = length

container.classList.remove('warning', 'danger')

if (length > 250) {
container.classList.add('danger')
} else if (length > 200) {
container.classList.add('warning')
}
})