import { useNavigate } from "react-router-dom";
import logo from "../assets/logoSmartRig.png"
// import logo from "../assets/logo.jpg";
// import logopc from "../assets/logopc.jpg";
import logoprocess from "../assets/logoProcess.svg";
import logoPalca from "../assets/logoVideoCard.svg";
import logoMotherBorad from "../assets/logoMotherboard.svg"
import logoMemory from "../assets/logoMemory.svg"
import logoPowerSupply from "../assets/logoPowerSupply.png"
import logoComputer from "../assets/logoComputer.svg"
import "../css/header.css";
import { LoginModal } from "../components/loginModal";
export function Header() {
    const navigate = useNavigate(); // Usando o hook useNavigate

    const handleClick = () => {
        navigate('/register'); // Redireciona para o URL desejado
    };


    return (
        <div>
            <header id="header">
             <div className="flex">
                <img src={logo} alt="Logo" className="IconSoft" />
                    <div>
                        <input type="search" placeholder="Pesquisar Produto ..." />
                    </div>
                    <nav className="navigation">
                        <ul>
                                {/* Botão que contém a imagem e o nome */}
                                <button type="button" onClick={handleClick} className="link-with-text">
                                {/* Imagem */}
                                <img src={logoprocess} alt="Logopc" className="IconImage" />
                                {/* Nome ao lado da imagem */}
                                <p className="name">Processador</p>
                                </button>
                                <button type="button" onClick={handleClick} className="link-with-text">
                                    {/* Imagem */}
                                    <img src={logoPalca} alt="Logopc" className="IconImage" />
                                    {/* Nome ao lado da imagem */}
                                    <p className="name">Placa de Vídeo</p>
                                </button>
                                <button type="button" onClick={handleClick} className="link-with-text">
                                    {/* Imagem */}
                                    <img src={logoMotherBorad} alt="Logopc" className="IconImage" />
                                    {/* Nome ao lado da imagem */}
                                    <p className="name">Placa Mãe</p>
                                </button>
                                <button type="button" onClick={handleClick} className="link-with-text">
                                    {/* Imagem */}
                                    <img src={logoMemory} alt="Logopc" className="IconImage" />
                                    {/* Nome ao lado da imagem */}
                                    <p className="name">Memórias</p>
                                </button>
                                <button type="button" onClick={handleClick} className="link-with-text">
                                    {/* Imagem */}
                                    <img src={logoPowerSupply} alt="Logopc" className="IconImage" />
                                    {/* Nome ao lado da imagem */}
                                    <p className="name">Fontes</p>
                                </button>
                                <button type="button" onClick={handleClick} className="link-with-text">
                                    {/* Imagem */}
                                    <img src={logoComputer} alt="Logopc" className="IconImage" />
                                    {/* Nome ao lado da imagem */}
                                    <p className="name">Monte seu PC</p>
                                </button>
                        </ul>
                    </nav>
                </div>
            </header>
            <LoginModal/>
        </div>
        
    );
}
