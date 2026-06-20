import { render, fireEvent, screen } from "@testing-library/react";
import { changeLink } from "./page";
import CardIndex from "../../components/cardIndex";

describe("Mudança de link", () => {
    const setIndex = jest.fn();
    test("Botão para trocar link", () => {
        const component = render(
            <button onClick = {() => changeLink("/1", setIndex)} />
        )
        const button = screen.getByRole("button");
        fireEvent.click(button);
        expect(setIndex).toHaveBeenCalledTimes(1);
        expect(setIndex).toHaveBeenCalledWith(1);
        expect(window.location.href).toMatch("/1");
    });

    test("CardIndex", () => {
        const component = render(
            <CardIndex 
                key = {0}
                name = {"Nome"}
                image = {"/images/affogato.png"}
                description = "AAA"
            />
        )
        expect(component).toMatchSnapshot();
    })
})