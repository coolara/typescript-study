"use strict";
const returnNum = () => 1 + 1;
var Items;
(function (Items) {
    Items[Items["Foo"] = returnNum()] = "Foo";
    Items[Items["Bar"] = 19] = "Bar";
    Items[Items["Baz"] = 20] = "Baz";
})(Items || (Items = {}));
//# sourceMappingURL=03-Literal%20and%20Enum.js.map