// @ts-ignore
import { SunmiV2Printer } from "react-native-sunmi-v2-printer";
import { base64TwitterLogo } from "../assets/logo";
import { profile } from "./profile";
import { IAddReturn } from "../types";
import { format, parseISO } from "date-fns";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

function stringdate(date: any) {
  const parsedDate = parseISO(date); // Convert the string to a Date object
  const formattedDate = format(parsedDate, "MMM d, yyyy"); // Format the date
  return formattedDate;
}

function formatNumberWithLeadingSpaceAndDecimal(number: Float) {
  const formattedNumber =
    number % 1 === 0 ? number.toFixed(2) : number.toFixed(2);
  const paddedNumber = formattedNumber.padStart(6);

  return paddedNumber;
}

export const printNamecard = async (successRes: IAddReturn) => {
  try {
    // set aligment: 0-left,1-center,2-right
    await SunmiV2Printer.setAlignment(1);

    // Image bitmap object (maximum width is 384 pixels, more than it can't be printed and throw exception)
    await SunmiV2Printer.printBitmap(
      profile.pcso,
      123 /* width */,
      123 /* height */
    );
    await SunmiV2Printer.printBitmap(
      profile.avatar,
      130 /* width */,
      130 /* height */
    );
    await SunmiV2Printer.printBitmap(
      profile.signal,
      130 /* width */,
      130 /* height */
    );

    await SunmiV2Printer.printOriginalText("\n");
    await SunmiV2Printer.setAlignment(1);
    await SunmiV2Printer.printOriginalText("Provident Marketing and Mobile\n");
    await SunmiV2Printer.printOriginalText("Enterprise, Inc.\n");
    await SunmiV2Printer.printOriginalText("Agusan Del Norte\n");

    await SunmiV2Printer.setAlignment(0);
    await SunmiV2Printer.setFontSize(23);
    await SunmiV2Printer.printOriginalText(
      `AGENT NAME : ${successRes.success.agent_name.toUpperCase()}\n`
    );
    await SunmiV2Printer.printOriginalText(
      `BET Date   : ${stringdate(successRes.success.draw_date)}\n`
    );
    await SunmiV2Printer.printOriginalText(
      `BET TIME   : ${successRes.success.bet_time}\n`
    );
    await SunmiV2Printer.printOriginalText(
      `DRAW TIME  : ${successRes.success.draw_time}\n`
    );
    await SunmiV2Printer.printOriginalText(
      `TRANS CODE : ${successRes.success.transaction_code} \n`
    );

    // await SunmiV2Printer.printOriginalText("=========================\n");
    await SunmiV2Printer.setAlignment(1);

    await SunmiV2Printer.printOriginalText(
      "--------------------------------\n"
    );
    await SunmiV2Printer.printOriginalText(`GAME       COMBINATION       BET`);
    await SunmiV2Printer.printOriginalText(
      "--------------------------------\n"
    );

    await SunmiV2Printer.setAlignment(1);

    async function printCombinationWithSpacing(
      combination: string,
      bet: string
    ): Promise<void> {
      await SunmiV2Printer.printOriginalText(`${successRes.success.game_type}`);
      await SunmiV2Printer.printOriginalText("         "); // Adjust the number of spaces as needed
      await SunmiV2Printer.printOriginalText(combination);
      await SunmiV2Printer.printOriginalText("            "); // Adjust the number of spaces as needed
      await SunmiV2Printer.printOriginalText(
        `${formatNumberWithLeadingSpaceAndDecimal(parseFloat(bet))}\n`
      );
    }
    // await SunmiV2Printer.setAlignment(1);
    for (const { combination, bet } of successRes.success.combinations) {
      await printCombinationWithSpacing(combination, bet);
    }

    await SunmiV2Printer.setAlignment(1);

    await SunmiV2Printer.printOriginalText(
      "--------------------------------\n"
    );

    await SunmiV2Printer.setAlignment(1);

    await SunmiV2Printer.printOriginalText("TOTAL"); // Adjust the number of spaces as needed
    await SunmiV2Printer.printOriginalText("                     "); // Adjust the number of spaces as needed
    await SunmiV2Printer.printOriginalText(
      `${formatNumberWithLeadingSpaceAndDecimal(successRes.success.total)}\n`
    );

    await SunmiV2Printer.setAlignment(1);
    await SunmiV2Printer.printQRCode(
      `${successRes.success.transaction_code}`,
      7 /* modulesize: which should be within 4-16 */,
      1 /* errorlevel: error correction level (0-3) */
    );

    await SunmiV2Printer.printOriginalText("\n");
    await SunmiV2Printer.setFontSize(23);
    await SunmiV2Printer.printOriginalText("Thank you for supporting STL!\n");
    await SunmiV2Printer.printOriginalText("No winning ticket, no claim\n");
    await SunmiV2Printer.printOriginalText("4.3.5");

    await SunmiV2Printer.printOriginalText("\n\n\n\n");
  } catch (e) {
    console.error(e);
  }
};
