/* eslint-disable max-len */
import { FC, memo } from 'react';
import { Helmet } from 'react-helmet-async';



export const DemoPageMeta: FC = memo(() => (
  <Helmet>
    <title>Информационная панель руководителя «Ритм»</title>
    <meta property='og:title' content='Информационная панель руководителя «Ритм»' />
    <meta property='og:description' content='Демо-примеры информационных панелей. Дизайн и функционал по Вашим требованиям!' />
    <meta property='og:image' content='https://firebasestorage.googleapis.com/v0/b/osnova-course.appspot.com/o/rhythm%2Fbase%2FПанель-демо1.jpg?alt=media&token=ca96b751-a7c9-4ddb-b664-4e0b0db167d1' />
    <meta property='og:url' content='https://rhy.thm.su/demo' />
    <meta property='og:type' content='website' />
  </Helmet>
));
