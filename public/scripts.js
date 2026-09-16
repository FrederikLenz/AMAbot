document.addEventListener('keydown',
function(event) {
    console.log('Tast trykket:', event.key)
    if (event.key === 'Escape') {
        console.log('Escape blev trykket!')
    }
})

/*
let input = document.querySelector('input')
input.addEventListener('input', function(event) {
    console.log('Value:', event.target.value)
})
let form = document.querySelector('form')
form.addEventListener('submit', function(event) {
    
    console.log('Form blev submittet')
    console.log('Form data:', new FormData(form))
})
*/



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