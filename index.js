const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// console.log(c);
// console.log(canvas);

class Player{
    constructor(x, y, radius, color){
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color

    }
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}

class Projectile {
    constructor( x, y, radius, color, velocity){
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

class Enemy {
    constructor( x, y, radius, color, velocity){
        this.x = x 
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }
    draw(){
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }

    update(){
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

const player = new Player(x, y, 30, 'blue')
const player2 = new Player(200, 200, 30, 'blue')



// player.draw() 
//player2.draw()

console.log(player)


const projectile = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', {x : 1, y: 1})
// const projectile2 = new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green', {x : -1, y: -1})
const projectiles = []
const enemies = []


function spawnEnemies(){
    setInterval(()=> {
        // console.log('go');
        const radius = Math.random() * (30 - 10) + 10
        // const x = Math.random() * canvas.width
        // const y = Math.random() * canvas.height
        let x
        let y
        if (Math.random() < 0.5 ){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
            // y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        const color = 'green'
        // const velocity = { x: 1, y: 1}
        const angle = Math.atan2( canvas.height / 2 - y, canvas.width / 2 - x )
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
        enemies.push(new Enemy(x, y, radius, color, velocity))
        // console.log(enemies)
    }, 1000)
}

let animationId

function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw() 
    projectiles.forEach((projectile, index)=> {
        
        projectile.update()
        //remove from edges of screen
        if( projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height
            ){
            setTimeout(() =>{

                projectiles.splice(index, 1)

            }, 0)
        }
    })
    // console.log('go')
    // projectile.draw()
    // projectile.update()
    enemies.forEach((enemy, index) => {
        enemy.update()

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
        
        //end game
        if (dist - enemy.radius - player.radius < 1 ) {
            // console.log('eng game')
            cancelAnimationFrame(animationId)
        }


        projectiles.forEach((projectile, projectileIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
            // console.log(dist);
            // console.log(dist - enemy.radius - projectile.radius)
            //object touche
            if (dist - enemy.radius - projectile.radius < 1 ) {
                // console.log('remove from screen');
                setTimeout(() =>{
                    enemies.splice(index, 1)
                    projectiles.splice(projectileIndex, 1)

                }, 0)
                

            }
        })
    })
}

addEventListener('click', (event)=> {
    // console.log(event.clientX)
    //console.log(angle)
    console.log(projectiles)
    
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2)
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'red', velocity)
    )
    // projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'green',{x : -1, y: -1}))
    
})

animate()
spawnEnemies()