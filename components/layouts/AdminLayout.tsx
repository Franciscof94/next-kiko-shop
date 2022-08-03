import { FC } from "react";
import styled from "styled-components";
import { SideMenu } from "../ui";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import AdminNavbar from "../admin/AdminNavbar";


interface Props {
    children: any;
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout: FC<Props> = ({
    children,
    title,
    subTitle,
    icon,
}) => {
    const openMenu = useSelector((state: RootState) => state.toggleMenu.toggleMenu);
    return (
        <Wrapper>
            {openMenu && <div style={{ position: 'absolute', transition: 'all 0.5s', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: "blur(8px)", width: '100%', zIndex: 11 }}></div>}
            <nav
                style={{
                    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                }}
            >
                <AdminNavbar />
            </nav>

            <SideMenu />

            <main
                style={{
                    margin: "10px auto",
                    maxWidth: "1440px",
                    padding: "0px 30px",
                }}
            >
                <div><h1>
                    {icon}
                    {title}
                </h1> </div>
                <h2>{subTitle}</h2>
                <div>
                    {children}
                </div>
            </main>

        </Wrapper>
    );
};

const Wrapper = styled.div`


`
