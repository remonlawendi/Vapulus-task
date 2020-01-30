export function getBase64FromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.addEventListener("load", e =>
      resolve(<string>(e.target as FileReader).result)
    );
  });
}
