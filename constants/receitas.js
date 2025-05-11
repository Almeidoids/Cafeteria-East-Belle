//Estilos
import styles from "../style/receitas.module.css";

//Fontes
import { caveat } from "../public/fonts/fonts";

const receitas = [
    {
        name: "Café Etíope",
        image: "/images/etiopeCoffe.png",
        description: "O café etíope é mais do que uma bebida, é uma tradição. Nascido nas terras altas da Etiópia, o berço do café, ele carrega consigo uma história rica e sabores únicos.",
        ingredients: 
            ["Grãos de café etiopes frescos", "Água", 
            "Moedor de café", "Filtro de papel ou pano (Dependendo do métodp)", 
            "Cafeteria de sua preferência", "Açúcar (opcional)"],
        preparation: 
            <>
                <li className = {styles.lists}><b>Moa os grãos:</b> Moa os grãos de café de um moedor, ajustando a moagem de acordo com o método escolhido</li>
                    <li className = {styles.lists}><b>Preparando o café:</b></li>
                    <ul className = {styles.ul} style = {caveat.style}>
                        <li>Usando filtro de papel, coloque-o na cafeteria e enxágue com água quente para remover o sabor do papel e pré-aquecer a cafeteira.</li>
                        <li>Aqueça a água até a temperatura ideal (90-95°C)</li>
                        <li>Coloque o café moido na cafeteira, seguindo as proporções recomendadas para o seu método de preparo.</li>
                        <li>Despeje a água quente sobre o café, garantindo que todos os grãos sejam saturados.</li>
                        <li>Aguarde o tempo de infusão necessário</li>
                    </ul>
                <li className = {styles.lists} ><b>Sirva o café:</b> Sirva o café quente e adicione açúcar se desejar.</li>
            </>,
        hints: 
            ["Use grãos de café etíopes de alta qualidade para um sabor autêntico+",
            "Experimente diferentes métodos de preparo para descobrir o seu favorito.",
            "Beba o café etíope com moderação, pois ele é forte e estimulante."],
        image0: "/images/receitas/ingredientesEtiope.jpg",
        image1: "/images/receitas/preparoEtiope.jpg",
        image2: "/images/receitas/dicasEtiope.jpg"
    },
    {
        name: "Affogato",
        image: "/images/affogato.png",
        description: 'O affogato, uma sobremesa italiana que significa "afogado", é uma combinação irresistível de café expresso quente e uma bola de sorvete, geralmente de baunilha.',
        ingredients: 
            ['1 ou 2 bolas de sorvete de creme (ou outro sabor de sua preferência)',
            "1 dose de café expresso quente (cerca de 30ml)",
            "Opcional: raspas de chocolate, biscoitos, chantilly ou licor"],
        preparation: 
            <>
                <li className = {styles.lists}><b>Prepare o café</b> Prepare uma dose de café expresso quente. Se você não tiver uma máquina de expresso, pode usar café forte feito em cafeteira italiana ou outro método de sua preferência.</li>
                <li className = {styles.lists}><b>Coloque o sorvete:</b> Em uma taça ou copo, coloque as bolas de sorvete.</li>
                <li className = {styles.lists} ><b>Despeje o café:</b> Despeje o café expresso quente sobre o sorvete.</li>
                <li className = {styles.lists} ><b>Sirva imediatamente:</b> O affogato é melhor apreciado imediatamente, enquanto o sorvete ainda está frio e o café quente.</li>
                <li className = {styles.lists} ><b>Adicione os acompanhamentos (opcional):</b> Se desejar, decore com raspas de chocolate, pedaços de biscoito, chantilly ou um fio de licor.</li>
            </>,
        hints: 
            ["Experimente diferentes sabores de sorvete, como chocolate, avelã ou pistache.",
            "Para uma versão mais sofisticada, use um licor de café ou amaretto.",
            "Se você preferir um affogato menos intenso, use café coado forte em vez de expresso.",
            "Para aqueles que não bebem café, pode-se utilizar chocolate quente."],
        image0: "/images/receitas/ingredientesAffogato.jpg",
        image1: "/images/receitas/PreparoAffogato.jpg",
        image2: "/images/receitas/dicasAffogato.png",

    },
    {
        name: "Café Mineiro",
        image: "/images/miningCoffe.png",
        description: "O café mineiro com leite e canela é uma bebida tradicional e reconfortante, perfeita para aquecer os dias frios.",
        ingredients: 
            ["1 litro de água filtrada",
            "4 colheres de sopa de café moído (moagem média)",
            "Filtro de papel",
            "Porta-filtro",
            "Bule ou garrafa térmica"],
        preparation: 
            <>
                <li className = {styles.lists}><b>Aqueça a água:</b> Aqueça a água até começar a ferver (antes de borbulhar).</li>
                <li className = {styles.lists}><b>Prepare o filtro:</b> Coloque o filtro de papel no porta-filtro.</li>
                <li className = {styles.lists} ><b>Adicione o café:</b> Coloque o café moído no filtro.</li>
                <li className = {styles.lists} ><b>Despeje a água:</b> Despeje um pouco de água quente sobre o café para umedecê-lo (pré-infusão).</li>
                <li className = {styles.lists} ><b>Despeje o restante da água:</b> Despeje o restante da água quente lentamente sobre o café, em movimentos circulares.</li>
                <li className = {styles.lists} ><b>Aguarde:</b> Deixe o café coar completamente.</li>
                <li className = {styles.lists} ><b>Sirva:</b> Sirva o café quente em xícaras.</li>
            </>,
        hints: 
            ["Use grãos de café de alta qualidade, de preferência produzidos em Minas Gerais.",
            "Moa os grãos na hora do preparo para um sabor mais fresco.",
            "Ajuste a quantidade de café e água de acordo com o seu paladar.",
            "Para um café mais forte, use mais café ou menos água.",
            "Para um café mais suave, use menos café ou mais água.",
            "Adoce a gosto, se desejar.",
            "Sirva o café acompanhado de pão de queijo, biscoito de polvilho ou outros quitutes mineiros."],
        image0: "/images/receitas/ingredientesMineiro.jpg",
        image1: "/images/receitas/preparoMineiro.jpg",
        image2: "/images/receitas/dicasMineiro.jpg",
    },
]

export default receitas;