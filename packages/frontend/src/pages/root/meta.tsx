/* eslint-disable max-len */
import { FC, memo } from 'react';
import { Helmet } from 'react-helmet-async';



export const RootPageMeta: FC = memo(() => (
  <Helmet>
    <title>Информационная панель руководителя «Ритм»</title>
    <meta property='og:title' content='Информационная панель руководителя «Ритм»' />
    <meta property='og:description' content='Держите руку на пульсе с «Ритмом»! Разработка уникальных информационных панелей по Вашим требованиям' />
    <meta property='og:image' content='https://firebasestorage.googleapis.com/v0/b/osnova-course.appspot.com/o/rhythm%2Fbase%2FПанель-демо1.jpg?alt=media&token=ca96b751-a7c9-4ddb-b664-4e0b0db167d1' />
    <meta property='og:url' content='https://rhy.thm.su' />
    <meta property='og:type' content='website' />
    <meta property='og:site_name' content='«Ритм»' />
  </Helmet>
));
