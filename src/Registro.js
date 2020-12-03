import React, { useState } from "react";
import Conecta from "./Conecta";
import { useForm } from "react-hook-form";

const Registro = () => {
  const { register, handleSubmit, errors } = useForm();
  const [aviso, setAviso] = useState("");
  const [foto, setFoto] = useState("");

  const habilitarCamera = async (e) => {
    // impede o comportamento default do submit no form
    e.preventDefault();    

    // Obtém acesso à câmera...
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (mediaStream) {
          var video = document.getElementById("video");
          video.style.visibility = "visible";
          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    }
  };

  const capturarFoto = () => {
    var canvas = document.getElementById("canvas");
    var video = document.getElementById("video");

    var context = canvas.getContext("2d");

    // desenha no canvas a imagem do vídeo
    context.drawImage(video, 0, 0, 320, 240);

    // pausa e esconde a câmera
    video.pause();
    video.style.visibility = "hidden";

    // muda o state com a imagem
    setFoto(canvas.toDataURL("image/png"));
  };

  const enviarTreino = async (data, e) => {
    if (data.nome === "" || data.treino === "" || foto === "") {
      setAviso("Por favor, preencha nome, treino e capture a foto");
      tempoAviso();
      return;
    }

    const formData = new FormData();
    formData.append("nome", data.nome);
    formData.append("treino", data.treino);
    formData.append("foto", foto);

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    try {
      const reg = await Conecta.post("inc_treino.php", formData, config);
      setAviso("Ok! Treino cadastrado com sucesso");
      limparFoto();
      e.target.reset();
    } catch (erro) {
      setAviso(`Erro... Treino não inserido: ${erro}`);
    }
    tempoAviso();
  };

  const tempoAviso = () => {
    setTimeout(() => {
      setAviso("");
    }, 3000);
  };

  const limparFoto = () => {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");

    // "limpa" um retângulo do tamanho do canvas
    context.clearRect(0, 0, 320, 240);

    // limpa o state da variável foto
    setFoto("");
  }

  return (
    <form
      className="mx-4 mt-3"
      onSubmit={handleSubmit(enviarTreino)}
      encType="multipart/form-data"
    >
      <div className="row">
        <div className="col-sm-6">
          <div className="form-group">
            <label htmlFor="nome">Nome do Aluno:</label>
            <input
              type="text"
              className="form-control"
              name="nome"
              ref={register({ required: true })}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="treino">Treino:</label>
            <input
              type="text"
              className="form-control"
              name="treino"
              ref={register({ required: true })}
            />
          </div>
          <div
            className={
              (errors.nome || errors.treino || errors.foto) &&
              "alert alert-danger mt-3"
            }
          >
            {(errors.nome || errors.treino || errors.foto) && (
              <span>Por favor, preencha todos os campos</span>
            )}
          </div>

          <div className="row">
            <div className="col-sm-4">
              <input
                type="submit"
                className="btn btn-success btn-block mt-1"
                onClick={habilitarCamera}
                value="Habilitar Câmera"
              />
            </div>
            <div className="col-sm-4">
              <input
                type="reset"
                className="btn btn-danger btn-block mt-1"
                value="Limpar"
                onClick={limparFoto}
              />
            </div>
            <div className="col-sm-4">
              <input
                type="submit"
                className="btn btn-primary btn-block mt-1"
                value="Gravar"
              />
            </div>
          </div>
          {aviso !== "" ? (
            <div className="alert alert-info mt-4">{aviso}</div>
          ) : (
            ""
          )}
        </div>
        <div className="col-sm-6">
          <video id="video" width="320" height="240"></video>
          <canvas id="canvas" width="320" height="240"></canvas>

          <input
            type="button"
            className="btn btn-danger float-right mt-3 px-5"
            onClick={capturarFoto}
            value="Capturar Foto"
          />
        </div>
      </div>
    </form>
  );
};

export default Registro;
