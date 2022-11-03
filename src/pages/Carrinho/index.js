import {
  Button,
  Snackbar,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { useCarrinhoContext } from "common/context/Carrinho";
import { usePagamentoContext } from "common/context/Pagamentos";
import { UsuarioContext } from "common/context/Usuario";
import { useContext, useMemo } from "react";
import Produto from "components/Produto";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Container,
  Voltar,
  TotalContainer,
  PagamentoContainer,
} from "./styles";

function Carrinho() {
  const history = useHistory();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { carrinho, valorTotalCarrinho,efetuarCompra } = useCarrinhoContext();
  const { saldo = 0 } = useContext(UsuarioContext);
  const { formaPagamento, tiposPagamentos, mudarFormaPagamento } =
    usePagamentoContext();
  const ValorFinal = useMemo(
    () => saldo - valorTotalCarrinho,
    [saldo, valorTotalCarrinho]
  );
  return (
    <Container>
      <Voltar onClick={() => history.goBack()} />
      <h2>Carrinho</h2>
      {carrinho.map((produto) => (
        <Produto {...produto} key={produto.id} />
      ))}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select
          value={formaPagamento.id}
          onChange={(evento) => mudarFormaPagamento(evento.target.value)}
        >
          {tiposPagamentos.map((pagamento) => (
            <MenuItem value={pagamento.id} key={pagamento.id}>
              {pagamento.nome}
            </MenuItem>
          ))}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R$ {valorTotalCarrinho.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span> R$ {Number(saldo).toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span> R$ {ValorFinal.toFixed(2)}</span>
        </div>
      </TotalContainer>
      <Button
        onClick={() => {
          setOpenSnackbar(true);
          efetuarCompra();
          history.push("/feira")
        }}
        disabled={ValorFinal < 0 || carrinho.length === 0}
        color="primary"
        variant="contained"
      >
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
      >
        <MuiAlert onClose={() => setOpenSnackbar(false)} severity="success">
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Carrinho;
