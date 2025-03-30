import {JSX} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons/faEnvelope";
import {faGithub} from "@fortawesome/free-brands-svg-icons/faGithub";

export default function Footer(): JSX.Element {
    return <footer>
        <footer className="footer justify-between sm:footer-horizontal bg-neutral text-neutral-content p-10 px-16">
            <aside>
                <img src="/spaceguard-logo.png" alt="Logo" className="w-24 h-24 mb-4" />
                <p>
                    Space Guard Intl.
                    <br />
                    [Insert slogan here]
                </p>
            </aside>
            <nav>
                <h6 className="footer-title">Social</h6>
                <div className="grid grid-flow-col gap-4">
                    <a href="mailto:info@spaceguard.app"><FontAwesomeIcon icon={faEnvelope} size="2x" /></a>
                    <a href="https://github.com/Past-Deadline"><FontAwesomeIcon icon={faGithub} size="2x" /></a>
                </div>
            </nav>
        </footer>
    </footer>
}