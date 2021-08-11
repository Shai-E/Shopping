const pdf = require("pdf-creator-node");
const fs = require("fs");

const createPdfReceipt = async (products, user, payment, total) => {
    const html = fs.readFileSync("./middleware/receipt.html", "utf8");

    const receiptId = user.id + "-" + Date.now();
    
    const options = {
        format: "A4",
        orientation: "portrait",
        border: "1in",
        header: {
            height: "25mm",
            contents: `<div style="text-align: center;"><h2>De Moda Caliente<h2/></div>`
        },
        footer: {
            height: "28mm",
            contents: {
                first: "Thank You for Choosing House of Fashion!",
                2: 'Second page', // Any page number is working. 1-based index
                default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
                last: 'Last Page'
            }
        }
    };
    try{
        const document = {
            html,
            data: {
                products,
                total,
                user,
                receiptId,
                payment: payment.substr(payment.length-4,4)
            },
            path: __dirname+"../../../client/src/assets/receipts/" + receiptId + ".pdf"
        }
        await pdf.create(document, options);
        return receiptId+".pdf"
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    createPdfReceipt
}