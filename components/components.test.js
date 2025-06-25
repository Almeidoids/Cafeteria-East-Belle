import { render, screen, fireEvent, waitFor, renderHook } from "@testing-library/react";
import Carrossel, * as carousel from "./carrossel";
import * as form from "./formulario";
import { Cart } from "../constants/carrinho";
import React from "react";
import CardItens from "./cardItens";
import Menu from "./menu";
import Receitas from "./receitas";
import Rodape from "./rodape";

describe("Carrossel", () => {
    const requestAnimationMock = jest.fn()
        
    beforeEach(() => {
        global.backup = global.requestAnimationFrame;
        global.requestAnimationFrame = requestAnimationMock;     
    })

    afterAll(() => {
        global.requestAnimationFrame = global.backup;
        delete global.backup;
    })

    afterEach(() => {
        jest.clearAllMocks();
    })

    test("Botão para girar o Carrossel", () => {
        
        const rotate = jest.spyOn(carousel.carousel, "carouselAnimation").mockImplementation(jest.fn());   
        render(<Carrossel><div style = {{width: "100%"}} /></Carrossel>);
        
        const buttonRight = screen.getByText(">");
        fireEvent.click(buttonRight);
        expect(carousel.carousel.carouselAnimation).toHaveBeenCalledWith(expect.any(Object), 0);
        const buttonLeft = screen.getByText("<");
        fireEvent.click(buttonLeft);
        expect(carousel.carousel.carouselAnimation).toHaveBeenCalledWith(expect.any(Object), 0);

        rotate.mockRestore();
    });

    test("Scroll do carrossel", () => {
        const carouselObject = {scrollLeft: 0, clientWidth: 500, scrollTo: jest.fn()};

        carousel.carousel.carouselAnimation(carouselObject, 250);
        let fn = requestAnimationMock.mock.calls[0][0];
        fn();
        fn();
        expect(carouselObject.scrollTo).toHaveBeenCalledTimes(2);
        expect(carouselObject.scrollTo.mock.calls[1][0]).toBe(500);

        carousel.carousel.carouselAnimation(carouselObject, -250);
        fn = requestAnimationMock.mock.calls[2][0];
        fn();
        fn();
        expect(carouselObject.scrollTo).toHaveBeenCalledTimes(4);
        console.log(carouselObject.scrollTo.mock.calls[3][0]);
        expect(carouselObject.scrollTo.mock.calls[3][0]).toBe(-500);
    })

    test("Componente Carrossel", () => {
        const test = render(<Carrossel><div /></Carrossel>);
        expect(test).toMatchSnapshot();
    });

    
})

describe("Formulario", () => {
    const product = {quantity: 10, key: 1, originalp: 10, offer: 5, name: "arroz"};
    const setCart = jest.fn(fn => fn([]));
    const setCartLength = jest.fn();

    test("Testando se o item é adicionado ao carrinho ao clicar no botão", async () => {

        render(
                <form onSubmit = {(e) => (form.addCart(e, product, setCart, setCartLength))}>
                    <input type = "number" defaultValue = {5} />
                    <button type = "submit">Enviar</button>
                </form>
        );
        
        const buttonSubmit = screen.getByText("Enviar");
        fireEvent.click(buttonSubmit);

        expect(setCart).toHaveBeenCalledTimes(1);
        expect(setCart).toHaveBeenCalledWith(expect.any(Function));
        expect(setCart).toHaveReturnedWith([{amount: 5, product: "arroz", price: "47.50", id: 1}]);
        expect(setCartLength).toHaveBeenCalledWith(1);
    })

    test("Testando se o input volta a ser 1 no final da chamada", () => {
        render(
            <form onSubmit = {(e) => (form.addCart(e, product, setCart, setCartLength))}>
                <input type = "number" defaultValue = {5} data-testid = "num" />
                <button type = "submit">Enviar</button>
            </form>
        );
        const inputNum = screen.getByTestId("num");
        expect(inputNum.value).toMatch("5");

        const buttonSubmit = screen.getByText("Enviar");
        fireEvent.click(buttonSubmit);
        expect(inputNum.value).toMatch("1");
    })
})

describe("outros componentes", () => {
    test("cardItens", () => {
        const component = render(
            <CardItens 
                key = {0}
                offer = {12}
                image = {"/images/affogato.png"}
                title = {"nome"}
                original = {"123"}
                link = {`/produtos/0`}
            />
        )

        expect(component).toMatchSnapshot();
    });

    test("Receitas", () => {
        const component = render(
            <Receitas close = {() => {return}} i = {0} />
        )

        expect(component).toMatchSnapshot();
    })

    test("Rodape", () => {
        const component = render(
            <Rodape />
        )

        expect(component).toMatchSnapshot();
    })


})