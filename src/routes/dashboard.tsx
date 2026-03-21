import { Title } from "@solidjs/meta";
import { Header, Footer} from "~/components/Layout";
import { Page } from "~/components/Page";

export default function About() {
  return (
    <main>
    <Header/>
      <Title>Qiara | Dashboard</Title>
      <Page name="Dashboard" description="Lend, Borrow or Stake your assets, freely across wide range of Blockchains and Protocols, all in one place." header="Vaults" content={<div class="panel"><div class="border"></div><div class="border"></div></div>}></Page>
    <Footer/>
    </main>
  );
}
