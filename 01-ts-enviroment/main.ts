import HandleThemes from "./01-ts-enviroment";
import {expectType } from 'tsd'
expectType<string>('1')
const handles = new HandleThemes();
handles.getFolderFiles(".");
