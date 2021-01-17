window.addEventListener("load", () => {

    const tile = 20
    const width = 40
    const height = 40
    const tick = 200
    const snaccChance = 0.05
    const snacclife = 40

    let key
    let end
    const tail = []
    const snacc = []

    // Round to integer for odd sizes
    let x = Math.round(width / 2)
    let y = Math.round(height / 2)

    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas")
    canvas.width = width * tile
    canvas.height = height * tile

    const context = canvas.getContext("2d")

    // Render loop
    function render() {

        // Background
        context.fillStyle = "silver"
        context.fillRect(0, 0, canvas.width, canvas.height)

        // Snacc
        for (let index = 0; index < snacc.length; index++) {

            const item = snacc[index]
            const x = item[0]
            const y = item[1]
            const life = item[2]

            // Skip dead snacc
            if (life <= 0) {
                continue
            }

            context.fillStyle = "green"
            context.fillRect(x * tile, y * tile, tile, tile)
        }

        // Tail
        for (let index = 0; index < tail.length; index++) {

            const item = tail[index]
            const x = item[0]
            const y = item[1]

            context.fillStyle = "grey"
            context.fillRect(x * tile, y * tile, tile, tile)

        }

        // Head
        context.fillStyle = "black"
        context.fillRect(x * tile, y * tile, tile, tile)

        // End
        if (end) {
            context.fillStyle = "rgba(255, 0, 0, 0.5)"
            context.fillRect(0, 0, canvas.width, canvas.height)

            context.fillStyle = "red"
            context.font = "100px normal sans-serif"
            context.textAlign = "center"
            context.fillText("Game Over!", canvas.width / 2, canvas.height / 2)
        }

        window.requestAnimationFrame(render)
    }

    render()

    // Physics loop
    window.setInterval(() => {

        // End
        if (end) {
            return
        }

        // Tail
        if (key != undefined) {
            tail.push([x, y])
        }

        // Head
        switch (key) {
            case "ArrowUp": {
                y = y - 1
                break
            }

            case "ArrowRight": {
                x = x + 1
                break
            }

            case "ArrowDown": {
                y = y + 1
                break
            }

            case "ArrowLeft": {
                x = x - 1
                break
            }
        }

        // Wrap x
        if (x == width) {
            x = 0
        }

        else if (x == -1) {
            x = width - 1
        }

        // Wrap y
        if (y == height) {
            y = 0
        }

        else if (y == -1) {
            y = height - 1
        }

        // Crash
        for (let index = 0; index < tail.length; index++) {

            const item = tail[index]
            const tailX = item[0]
            const tailY = item[1]

            if (x == tailX && y == tailY) {
                end = true
            }
        }

        // Snacc spawn
        if (Math.random() < snaccChance) {
            const snaccX = Math.floor(Math.random() * width)
            const snaccY = Math.floor(Math.random() * height)
            snacc.push([snaccX, snaccY, snacclife])
        }

        // Snacc life & eat
        let eat

        for (let index = 0; index < snacc.length; index++) {
            const item = snacc[index]
            const snaccX = item[0]
            const snaccY = item[1]
            const life = item[2]
            item[2] -= 1

            if (x == snaccX && y == snaccY && life > 0) {
                eat = true
                item[2] = 0
            }
        }

        if (!eat) {
            tail.shift()
        }
    }, tick)

    document.addEventListener("keydown", (event) => {

        switch (event.key) {

            case "ArrowUp": {
                if (key == "ArrowDown") {
                    return
                }
                break
            }

            case "ArrowRight": {
                if (key == "ArrowLeft") {
                    return
                }
                break
            }

            case "ArrowDown": {
                if (key == "ArrowUp") {
                    return
                }
                break
            }

            case "ArrowLeft": {
                if (key == "ArrowRight") {
                    return
                }
                break
            }

            default: {
                return
            }

        }
        key = event.key
    })
})