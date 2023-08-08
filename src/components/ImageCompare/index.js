// import { html, css, LitElement } from "lit";
// import { customElement, property } from "lit/decorators.js";

// @customElement("simple-greeting")
// export class SimpleGreeting extends LitElement {
//   static styles = css`
//     p {
//       color: blue;
//     }
//   `;

//   @property()
//   name = "Somebody";

//   render() {
//     return html`<p>Hello, ${this.name}!</p>`;
//   }
// }

class HelloWorldComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<h1>Hello world!</h1>`;
  }
}

customElements.define('hello-world', HelloWorldComponent);
