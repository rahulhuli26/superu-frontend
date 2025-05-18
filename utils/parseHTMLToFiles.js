export default function parseHTMLToFiles(html) {
  return [
    {
      name: "index.html",
      path: "index.html",
      type: "file",
      html,
    },
  ];
}
