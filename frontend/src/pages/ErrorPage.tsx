import { isRouteErrorResponse, useRouteError, Link } from 'react-router-dom'

export default function ErrorPage() {
    const error = useRouteError()

    let message = 'Something went wrong'

    if (isRouteErrorResponse(error)) {
        message = error.statusText || `Error ${error.status}`
    } else if (error instanceof Error) {
        message = error.message
    }

    return (
        <main>
            <h1>oOOOonooo something went wrong :ooo</h1>
            <p role="alert">{message}</p>
            <Link to="/channels">Try again:D:D:D</Link>
        </main>
    )
}