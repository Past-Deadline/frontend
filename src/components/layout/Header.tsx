import {JSX} from "react";

export default function Header(): JSX.Element {
    return <header>
        <nav className="navbar bg-blue-600 text-white shadow-sm">
            <div className="navbar-start">
                <a className="btn btn-ghost text-2xl">Space Guard</a>
            </div>
            <div className="navbar-end hidden lg:flex">
                <ul className="menu menu-horizontal px-1 text-lg font-semibold">
                    <li><a href="/preview">Observation</a></li>
                    <li><a href="/scheduler">Scheduler</a></li>
                </ul>
            </div>
        </nav>
    </header>
}