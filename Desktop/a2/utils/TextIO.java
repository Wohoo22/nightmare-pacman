package utils;


import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.io.Reader;
import java.util.IllegalFormatException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.swing.JFileChooser;
import javax.swing.JOptionPane;

/**
 * TextIO provides a set of static methods for reading and writing text.  By default, it reads
 * from standard input and writes to standard output, but it is possible to redirect the input
 * and output to files or to other input and output streams.  When the standard input and output
 * streams are being used, the input methods will not produce an error; instead, the user is
 * repeatedly prompted for input until a legal input is entered.  (If standard input has been
 * changed externally, as by file redirection on the command line, this is not a reasonable
 * behavior; to handle this case, TextIO will give up after 10 consecutive illegal inputs and
 * will throw an IllegalArgumentException.)  For the most part, any other
 * error will be translated into an IllegalArguementException.
 * <p>For writing to standard output, the output methods in this class pretty much
 * duplicate the functionality of System.out, and System.out can be used interchangeably with them.
 * <p>This class does not use optimal Java programming practices.  It is designed specifically to be easily
 * usable even by a beginning programmer who has not yet learned about objects and exceptions.  Therefore, 
 * everything is in a single source file that compiles into a single class file, all the methods are
 * static methods, and none of the methods throw exceptions that would require try...catch statements.
 * Also for this reason, all exceptions are converted into IllegalArgumentExceptions, even when this
 * exception type doesn't really make sense.
 * <p>This class requires Java 5.0 or higher. (A previous version of TextIO required only Java 1.1;
 * this version should work with any source code that used the previous version, but it has some new
 * features, including the type of formatted output that was introduced in Java 5 and the ability to
 * use files and streams.)
 */
public class TextIO {

   /* Modified November 2007 to empty the TextIO input buffer when switching from one
    * input source to another. This fixes a bug that allows input from the previous input
    * source to be read after the new source has been selected.
    */

   /**
    * The value returned by the peek() method when the input is at end-of-file.
    * (The value of this constant is (char)0xFFFF.)
    */
   public static final char EOF = (char)0xFFFF;

   /**
    * The value returned by the peek() method when the input is at end-of-line.
    * The value of this constant is the character '\n'.
    */
   public static final char EOLN = '\n';          // The value returned by peek() when at end-of-line.
   

   /**
    * After this method is called, input will be read from standard input (as it 
    * is in the default state).  If a file or stream was previously the input source, that file
    * or stream is closed.
    */
   public static void readStandardInput() {
      if (TextIO.readingStandardInput)
         return;
      try {
         TextIO.in.close();
      }
      catch (final Exception e) {
      }
      TextIO.emptyBuffer();  // Added November 2007
      TextIO.in = TextIO.standardInput;
      TextIO.inputFileName = null;
      TextIO.readingStandardInput = true;
      TextIO.inputErrorCount = 0;
   }
   
   /**
    * After this method is called, input will be read from inputStream, provided it
    * is non-null.  If inputStream is null, then this method has the same effect
    * as calling readStandardInput(); that is, future input will come from the
    * standard input stream.
    */
   public static void readStream(final InputStream inputStream) {
      if (inputStream == null)
         TextIO.readStandardInput();
      else
         TextIO.readStream(new InputStreamReader(inputStream));
   }
   
   /**
    * After this method is called, input will be read from inputStream, provided it
    * is non-null.  If inputStream is null, then this method has the same effect
    * as calling readStandardInput(); that is, future input will come from the
    * standard input stream.
    */
   public static void readStream(final Reader inputStream) {
      if (inputStream == null)
         TextIO.readStandardInput();
      else {
         if ( inputStream instanceof BufferedReader)
            TextIO.in = (BufferedReader)inputStream;
         else
            TextIO.in = new BufferedReader(inputStream);
         TextIO.emptyBuffer();  // Added November 2007
         TextIO.inputFileName = null;
         TextIO.readingStandardInput = false;
         TextIO.inputErrorCount = 0;
      }
   }
   
   /**
    * Opens a file with a specified name for input.  If the file name is null, this has
    * the same effect as calling readStandardInput(); that is, input will be read from standard
    * input.  If an
    * error occurs while trying to open the file, an exception of type IllegalArgumentException
    * is thrown, and the input source is not changed.  If the file is opened 
    * successfully, then after this method is called, all of the input routines will read 
    * from the file, instead of from standard input.
    */
   public static void readFile(final String fileName) {
      if (fileName == null) // Go back to reading standard input
         TextIO.readStandardInput();
      else {
         final BufferedReader newin;
         try {
            newin = new BufferedReader( new FileReader(fileName) );
         }
         catch (final Exception e) {
            throw new IllegalArgumentException("Can't open file \"" + fileName + "\" for input.\n"
                           + "(Error :" + e + ")");
         }
         if (!TextIO.readingStandardInput) { // close current input stream
            try {
               TextIO.in.close();
            }
            catch (final Exception e) {
            }
         }
         TextIO.emptyBuffer();  // Added November 2007
         TextIO.in = newin;
         TextIO.readingStandardInput = false;
         TextIO.inputErrorCount = 0;
         TextIO.inputFileName = fileName;
      }
   }

   /**
    * Puts a GUI file-selection dialog box on the screen in which the user can select
    * an input file.  If the user cancels the dialog instead of selecting a file, it is
    * not considered an error, but the return value of the subroutine is false.
    * If the user does select a file, but there is an error while trying to open the
    * file, then an exception of type IllegalArgumentException is thrown.  Finally, if
    * the user selects a file and it is successfully opened, then the return value of the
    * subroutine is true, and  the input routines will read from the file, instead of 
    * from standard input.   If the user cancels, or if any error occurs, then the
    * previous input source is not changed.
    * <p>NOTE: Calling this method starts a GUI user interface thread, which can continue
    * to run even if the thread that runs the main program ends.  If you use this method
    * in a non-GUI program, it might be necessary to call System.exit(0) at the end of the main() 
    * routine to shut down the Java virtual machine completely.
    */
   public static boolean readUserSelectedFile() {
      if (TextIO.fileDialog == null)
         TextIO.fileDialog = new JFileChooser();
      TextIO.fileDialog.setDialogTitle("Select File for Input");
      final int option = TextIO.fileDialog.showOpenDialog(null);
      if (option != JFileChooser.APPROVE_OPTION)
         return false;
      final File selectedFile = TextIO.fileDialog.getSelectedFile();
      final BufferedReader newin;
      try {
         newin = new BufferedReader( new FileReader(selectedFile) );
      }
      catch (final Exception e) {
         throw new IllegalArgumentException("Can't open file \"" + selectedFile.getName() + "\" for input.\n"
                        + "(Error :" + e + ")");
      }
      if (!TextIO.readingStandardInput) { // close current file
         try {
            TextIO.in.close();
         }
         catch (final Exception e) {
         }
      }
      TextIO.emptyBuffer();  // Added November 2007
      TextIO.in = newin;
      TextIO.inputFileName = selectedFile.getName();
      TextIO.readingStandardInput = false;
      TextIO.inputErrorCount = 0;
      return true;
   }
   
   /**
    * After this method is called, output will be written to standard output (as it 
    * is in the default state).  If a file or stream was previously open for output, it
    * will be closed.
    */
   public static void writeStandardOutput() {
      if (TextIO.writingStandardOutput)
         return;
      try {
         TextIO.out.close();
      }
      catch (final Exception e) {
      }
      TextIO.outputFileName = null;
      TextIO.outputErrorCount = 0;
      TextIO.out = TextIO.standardOutput;
      TextIO.writingStandardOutput = true;
   }
   

   /**
    * After this method is called, output will be sent to outputStream, provided it
    * is non-null.  If outputStream is null, then this method has the same effect
    * as calling writeStandardOutput(); that is, future output will be sent to the
    * standard output stream.
    */
   public static void writeStream(final OutputStream outputStream) {
      if (outputStream == null)
         TextIO.writeStandardOutput();
      else
         TextIO.writeStream(new PrintWriter(outputStream));
   }
   
   /**
    * After this method is called, output will be sent to outputStream, provided it
    * is non-null.  If outputStream is null, then this method has the same effect
    * as calling writeStandardOutput(); that is, future output will be sent to the
    * standard output stream.
    */
   public static void writeStream(final PrintWriter outputStream) {
      if (outputStream == null)
         TextIO.writeStandardOutput();
      else {
         TextIO.out = outputStream;
         TextIO.outputFileName = null;
         TextIO.outputErrorCount = 0;
         TextIO.writingStandardOutput = false;
      }
   }
   

   /**
    * Opens a file with a specified name for output.  If the file name is null, this has
    * the same effect as calling writeStandardOutput(); that is, output will be sent to standard
    * output.  If an
    * error occurs while trying to open the file, an exception of type IllegalArgumentException
    * is thrown.  If the file is opened successfully, then after this method is called,
    * all of the output routines will write to the file, instead of to  standard output.
    * If an error occurs, the output destination is not changed.
    * <p>NOTE: Calling this method starts a GUI user interface thread, which can continue
    * to run even if the thread that runs the main program ends.  If you use this method
    * in a non-GUI program, it might be necessary to call System.exit(0) at the end of the main() 
    * routine to shut down the Java virtual machine completely.
    */
   public static void writeFile(final String fileName) {
      if (fileName == null)  // Go back to reading standard output
         TextIO.writeStandardOutput();
      else {
         final PrintWriter newout;
         try {
            newout = new PrintWriter(new FileWriter(fileName));
         }
         catch (final Exception e) {
            throw new IllegalArgumentException("Can't open file \"" + fileName + "\" for output.\n"
                           + "(Error :" + e + ")");
         }
         if (!TextIO.writingStandardOutput) {
            try {
               TextIO.out.close();
            }
            catch (final Exception e) {
            }
         }
         TextIO.out = newout;
         TextIO.writingStandardOutput = false;
         TextIO.outputFileName = fileName;
         TextIO.outputErrorCount = 0;
      }
   }
   
   /**
    * Puts a GUI file-selection dialog box on the screen in which the user can select
    * an output file.  If the user cancels the dialog instead of selecting a file, it is
    * not considered an error, but the return value of the subroutine is false.
    * If the user does select a file, but there is an error while trying to open the
    * file, then an exception of type IllegalArgumentException is thrown.  Finally, if
    * the user selects a file and it is successfully opened, then the return value of the
    * subroutine is true, and  the output routines will write to the file, instead of 
    * to standard output.  If the user cancels, or if an error occurs, then the current
    * output destination is not changed.
    */
   public static boolean writeUserSelectedFile() {
      if (TextIO.fileDialog == null)
         TextIO.fileDialog = new JFileChooser();
      TextIO.fileDialog.setDialogTitle("Select File for Output");
      File selectedFile;
      while (true) {
         final int option = TextIO.fileDialog.showSaveDialog(null);
         if (option != JFileChooser.APPROVE_OPTION)
            return false;  // user canceled
         selectedFile = TextIO.fileDialog.getSelectedFile();
         if (selectedFile.exists()) {
            final int response = JOptionPane.showConfirmDialog(null,
                  "The file \"" + selectedFile.getName() + "\" already exists.  Do you want to replace it?",
                  "Replace existing file?",
                  JOptionPane.YES_NO_OPTION, JOptionPane.WARNING_MESSAGE);
            if (response == JOptionPane.YES_OPTION)
               break;
         }
         else {
            break;
         }
      }
      final PrintWriter newout;
      try {
         newout = new PrintWriter(new FileWriter(selectedFile));
      }
      catch (final Exception e) {
         throw new IllegalArgumentException("Can't open file \"" + selectedFile.getName() + "\" for output.\n"
                        + "(Error :" + e + ")");
      }
      if (!TextIO.writingStandardOutput) {
         try {
            TextIO.out.close();
         }
         catch (final Exception e) {
         }
      }
      TextIO.out = newout;
      TextIO.writingStandardOutput = false;
      TextIO.outputFileName = selectedFile.getName();
      TextIO.outputErrorCount = 0;
      return true;
   }
   

   /**
    * If TextIO is currently reading from a file, then the return value is the name of the file.  
    * If the class is reading from standard input or from a stream, then the return value is null.
    */
   public static String getInputFileName() {
      return TextIO.inputFileName;
   }
   

   /**
    * If TextIO is currently writing to a file, then the return value is the name of the file.  
    * If the class is writing to standard output or to a stream, then the return value is null.
    */
   public static String getOutputFileName() {
      return TextIO.outputFileName;
   }
   

   // *************************** Output Methods *********************************
      
   /**
    * Write a single value to the current output destination, using the default format
    * and no extra spaces.  This method will handle any type of parameter, even one
    * whose type is one of the primitive types.
    */
   public static void put(final Object x) {
      TextIO.out.print(x);
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }
   
   /**
    * Write a single value to the current output destination, using the default format
    * and outputting at least minChars characters (with extra spaces added before the
    * output value if necessary).  This method will handle any type of parameter, even one
    * whose type is one of the primitive types.
    * @param x The value to be output, which can be of any type.
    * @param minChars The minimum number of characters to use for the output.  If x requires fewer
    * then this number of characters, then extra spaces are added to the front of x to bring
    * the total up to minChars.  If minChars is less than or equal to zero, then x will be printed
    * in the minumum number of spaces possible.
    */
   public static void put(final Object x, final int minChars)  {
      if (minChars <= 0)
         TextIO.out.print(x);
      else
         TextIO.out.printf("%" + minChars + "s", x);
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }
      
   /**
    * This is equivalent to put(x), followed by an end-of-line.
    */
   public static void putln(final Object x) {
      TextIO.out.println(x);
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }
   
   /**
    * This is equivalent to put(x,minChars), followed by an end-of-line.
    */
   public static void putln(final Object x, final int minChars) {
      TextIO.put(x,minChars);
      TextIO.out.println();
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }

   /**
    * Write an end-of-line character to the current output destination.
    */
   public static void putln() {
      TextIO.out.println();
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }
   
   /**
    * Writes formatted output values to the current output destination.  This method has the
    * same function as System.out.printf(); the details of formatted output are not discussed
    * here.  The first parameter is a string that describes the format of the output.  There
    * can be any number of additional parameters; these specify the values to be output and
    * can be of any type.  This method will throw an IllegalArgumentException if the
    * format string is null or if the format string is illegal for the values that are being
    * output.
    */
   public static void putf(final String format, final Object... items) {
      if (format == null)
         throw new IllegalArgumentException("Null format string in TextIO.putf() method.");
      try {
         TextIO.out.printf(format,items);
      }
      catch (final IllegalFormatException e) {
         throw new IllegalArgumentException("Illegal format string in TextIO.putf() method.");
      }
      TextIO.out.flush();
      if (TextIO.out.checkError())
         TextIO.outputError("Error while writing output.");
   }
   
   // *************************** Input Methods *********************************

   /**
    * Test whether the next character in the current input source is an end-of-line.  Note that
    * this method does NOT skip whitespace before testing for end-of-line -- if you want to do
    * that, call skipBlanks() first.
    */
   public static boolean eoln() { 
      return TextIO.peek() == '\n';
   }

   /**
    * Test whether the next character in the current input source is an end-of-file.  Note that
    * this method does NOT skip whitespace before testing for end-of-line -- if you want to do
    * that, call skipBlanks() or skipWhitespace() first.
    */
   public static boolean eof()  { 
      return TextIO.peek() == TextIO.EOF;
   }
   
   /**
    * Reads the next character from the current input source.  The character can be a whitespace
    * character; compare this to the getChar() method, which skips over whitespace and returns the
    * next non-whitespace character.  An end-of-line is always returned as the character '\n', even
    * when the actual end-of-line in the input source is something else, such as '\r' or "\r\n".
    * This method will throw an IllegalArgumentException if the input is at end-of-file (which will 
    * not ordinarily happen if reading from standard input).
    */
   public static char getAnyChar() { 
      return TextIO.readChar();
   }

   /**
    * Returns the next character in the current input source, without actually removing that
    * character from the input.  The character can be a whitespace character and can be the
    * end-of-file character (specified by the constant TextIO.EOF).An end-of-line is always returned 
    * as the character '\n', even when the actual end-of-line in the input source is something else, 
    * such as '\r' or "\r\n".  This method never causes an error.
    */
   public static char peek() { 
      return TextIO.lookChar();
   }
   
   /**
    * Skips over any whitespace characters, except for end-of-lines.  After this method is called,
    * the next input character is either an end-of-line, an end-of-file, or a non-whitespace character.
    * This method never causes an error.  (Ordinarily, end-of-file is not possible when reading from
    * standard input.)
    */
   public static void skipBlanks() { 
      char ch= TextIO.lookChar();
      while (ch != TextIO.EOF && ch != '\n' && Character.isWhitespace(ch)) {
         TextIO.readChar();
         ch = TextIO.lookChar();
      }
   }

   /**
    * Skips over any whitespace characters, including for end-of-lines.  After this method is called,
    * the next input character is either an end-of-file or a non-whitespace character.
    * This method never causes an error. (Ordinarily, end-of-file is not possible when reading from
    * standard input.)
    */
   private static void skipWhitespace() {
      char ch= TextIO.lookChar();
      while (ch != TextIO.EOF && Character.isWhitespace(ch)) {
         TextIO.readChar();
         if (ch == '\n' && TextIO.readingStandardInput && TextIO.writingStandardOutput) {
            TextIO.out.print("? ");
            TextIO.out.flush();
         }
         ch = TextIO.lookChar();
      }
   }

   /**
    * Skips whitespace characters and then reads a value of type byte from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static byte getlnByte() { 
      final byte x= TextIO.getByte();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * Skips whitespace characters and then reads a value of type short from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static short getlnShort() {
      final short x= TextIO.getShort();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * Skips whitespace characters and then reads a value of type int from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static int getlnInt() { 
      final int x= TextIO.getInt();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * Skips whitespace characters and then reads a value of type long from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static long getlnLong() {
      final long x= TextIO.getLong();
      TextIO.emptyBuffer();
      return x;
   }
   
   /**
    * Skips whitespace characters and then reads a value of type float from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static float getlnFloat() {
      final float x= TextIO.getFloat();
      TextIO.emptyBuffer();
      return x;
   }
   
   /**
    * Skips whitespace characters and then reads a value of type double from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static double getlnDouble() { 
      final double x= TextIO.getDouble();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * Skips whitespace characters and then reads a value of type char from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  Note that the value
    * that is returned will be a non-whitespace character; compare this with the getAnyChar() method.
    * When using standard IO, this will not produce an error.  In other cases, an error can occur if
    * an end-of-file is encountered.
    */
   public static char getlnChar() {
      final char x= TextIO.getChar();
      TextIO.emptyBuffer();
      return x;
   }
   
   /**
    * Skips whitespace characters and then reads a value of type boolean from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    * <p>Legal inputs for a boolean input are: true, t, yes, y, 1, false, f, no, n, and 0; letters can be
    * either upper case or lower case. One "word" of input is read, using the getWord() method, and it
    * must be one of these; note that the "word"  must be terminated by a whitespace character (or end-of-file).
    */
   public static boolean getlnBoolean() { 
      final boolean x= TextIO.getBoolean();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * Skips whitespace characters and then reads one "word" from input, discarding the rest of 
    * the current line of input (including the next end-of-line character, if any).  A word is defined as
    * a sequence of non-whitespace characters (not just letters!).   When using standard IO,
    * this will not produce an error.  In other cases, an IllegalArgumentException will be thrown
    * if an end-of-file is encountered.
    */
   public static String getlnWord() {
      final String x= TextIO.getWord();
      TextIO.emptyBuffer();
      return x; 
   }
   
   /**
    * This is identical to getln().
    */
   public static String getlnString() {
      return TextIO.getln();
   } 
   
   /**
    * Reads all the characters from the current input source, up to the next end-of-line.  The end-of-line
    * is read but is not included in the return value.  Any other whitespace characters on the line are retained,
    * even if they occur at the start of input.  The return value will be an empty string if there are no
    * no characters before the end-of-line.  When using standard IO, this will not produce an error.  
    * In other cases, an IllegalArgumentException will be thrown if an end-of-file is encountered.
    */
   public static String getln() {
      final StringBuffer s = new StringBuffer(100);
      char ch = TextIO.readChar();
      while (ch != '\n') {
         s.append(ch);
         ch = TextIO.readChar();
      }
      return s.toString();
   }
   
   /**
    * Skips whitespace characters and then reads a value of type byte from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static byte getByte()   { 
      return (byte) TextIO.readInteger(-128L,127L);
   }

   /**
    * Skips whitespace characters and then reads a value of type short from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static short getShort() { 
      return (short) TextIO.readInteger(-32768L,32767L);
   }   
   
   /**
    * Skips whitespace characters and then reads a value of type int from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static int getInt()     { 
      return (int) TextIO.readInteger(Integer.MIN_VALUE, Integer.MAX_VALUE);
   }
   
   /**
    * Skips whitespace characters and then reads a value of type long from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static long getLong()   { 
      return TextIO.readInteger(Long.MIN_VALUE, Long.MAX_VALUE);
   }
   
   /**
    * Skips whitespace characters and then reads a single non-whitespace character from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error.  In other cases, an IllegalArgumentException will be thrown if an end-of-file
    * is encountered.
    */
   public static char getChar() {
      TextIO.skipWhitespace();
      return TextIO.readChar();
   }
   
   /**
    * Skips whitespace characters and then reads a value of type float from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static float getFloat() {
      float x = 0.0F;
      while (true) {
         final String str = TextIO.readRealString();
         if (str == null) {
            TextIO.errorMessage("Floating point number not found.",
                  "Real number in the range " + (-Float.MAX_VALUE) + " to " + Float.MAX_VALUE);
         }
         else {
            try { 
               x = Float.parseFloat(str); 
            }
            catch (final NumberFormatException e) {
               TextIO.errorMessage("Illegal floating point input, " + str + ".",
                     "Real number in the range " +  (-Float.MAX_VALUE) + " to " + Float.MAX_VALUE);
               continue;
            }
            if (Float.isInfinite(x)) {
               TextIO.errorMessage("Floating point input outside of legal range, " + str + ".",
                     "Real number in the range " +  (-Float.MAX_VALUE) + " to " + Float.MAX_VALUE);
               continue;
            }
            break;
         }
      }
      TextIO.inputErrorCount = 0;
      return x;
   }
   
   /**
    * Skips whitespace characters and then reads a value of type double from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    */
   public static double getDouble() {
      double x = 0.0;
      while (true) {
         final String str = TextIO.readRealString();
         if (str == null) {
            TextIO.errorMessage("Floating point number not found.",
                  "Real number in the range " + (-Double.MAX_VALUE) + " to " + Double.MAX_VALUE);
         }
         else {
            try { 
               x = Double.parseDouble(str); 
            }
            catch (final NumberFormatException e) {
               TextIO.errorMessage("Illegal floating point input, " + str + ".",
                     "Real number in the range " + (-Double.MAX_VALUE) + " to " + Double.MAX_VALUE);
               continue;
            }
            if (Double.isInfinite(x)) {
               TextIO.errorMessage("Floating point input outside of legal range, " + str + ".",
                     "Real number in the range " + (-Double.MAX_VALUE) + " to " + Double.MAX_VALUE);
               continue;
            }
            break;
         }
      }
      TextIO.inputErrorCount = 0;
      return x;
   }
   
   /**
    * Skips whitespace characters and then reads one "word" from input. Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  A word is defined as
    * a sequence of non-whitespace characters (not just letters!).   When using standard IO,
    * this will not produce an error.  In other cases, an IllegalArgumentException will be thrown
    * if an end-of-file is encountered.
    */
   public static String getWord() {
      TextIO.skipWhitespace();
      final StringBuffer str = new StringBuffer(50);
      char ch = TextIO.lookChar();
      while (ch == TextIO.EOF || !Character.isWhitespace(ch)) {
         str.append(TextIO.readChar());
         ch = TextIO.lookChar();
      }
      return str.toString();
   }
   
   /**
    * Skips whitespace characters and then reads a value of type boolean from input.  Any additional characters on
    * the current line of input are retained, and will be read by the next input operation.  When using standard IO,
    * this will not produce an error; the user will be prompted repeatedly for input until a legal value
    * is input.  In other cases, an IllegalArgumentException will be thrown if a legal value is not found.
    * <p>Legal inputs for a boolean input are: true, t, yes, y, 1, false, f, no, n, and 0; letters can be
    * either upper case or lower case. One "word" of input is read, using the getWord() method, and it
    * must be one of these; note that the "word"  must be terminated by a whitespace character (or end-of-file).
    */
   public static boolean getBoolean() {
      boolean ans = false;
      while (true) {
         final String s = TextIO.getWord();
         if ( s.equalsIgnoreCase("true") || s.equalsIgnoreCase("t") ||
               s.equalsIgnoreCase("yes")  || s.equalsIgnoreCase("y") ||
               s.equals("1") ) {
            ans = true;
            break;
         }
         else if ( s.equalsIgnoreCase("false") || s.equalsIgnoreCase("f") ||
               s.equalsIgnoreCase("no")  || s.equalsIgnoreCase("n") ||
               s.equals("0") ) {
            ans = false;
            break;
         }
         else
            TextIO.errorMessage("Illegal boolean input value.",
            "one of:  true, false, t, f, yes, no, y, n, 0, or 1");
      }
      TextIO.inputErrorCount = 0;
      return ans;
   }
   
   // ***************** Everything beyond this point is private implementation detail *******************
   
   private static String inputFileName;  // Name of file that is the current input source, or null if the source is not a file.
   private static String outputFileName; // Name of file that is the current output destination, or null if the destination is not a file.
   
   private static JFileChooser fileDialog; // Dialog used by readUserSelectedFile() and writeUserSelectedFile()
   
   private static final BufferedReader standardInput = new BufferedReader(new InputStreamReader(java.lang.System.in));  // wraps standard input stream
   private static final PrintWriter standardOutput = new PrintWriter(java.lang.System.out);  // wraps standard output stream

   private static BufferedReader in = TextIO.standardInput;  // Stream that data is read from; the current input source.
   private static PrintWriter out = TextIO.standardOutput;   // Stream that data is written to; the current output destination.
   
   private static boolean readingStandardInput = true;
   private static boolean writingStandardOutput = true;
   
   private static int inputErrorCount;  // Number of consecutive errors on standard input; reset to 0 when a successful read occurs.
   private static int outputErrorCount;  // Number of errors on standard output since it was selected as the output destination.
   
   private static Matcher integerMatcher;  // Used for reading integer numbers; created from the integer Regex Pattern.
   private static Matcher floatMatcher;   // Used for reading floating point numbers; created from the floatRegex Pattern.
   private static final Pattern integerRegex = Pattern.compile("(\\+|-)?[0-9]+");
   private static final Pattern floatRegex = Pattern.compile("(\\+|-)?(([0-9]+(\\.[0-9]*)?)|(\\.[0-9]+))((e|E)(\\+|-)?[0-9]+)?");
   
   private static String buffer;  // One line read from input.
   private static int pos;           // Position of next char in input line that has not yet been processed.
   
   private static String readRealString() {   // read chars from input following syntax of real numbers
      TextIO.skipWhitespace();
      if (TextIO.lookChar() == TextIO.EOF)
         return null;
      if (TextIO.floatMatcher == null)
         TextIO.floatMatcher = TextIO.floatRegex.matcher(TextIO.buffer);
      TextIO.floatMatcher.region(TextIO.pos, TextIO.buffer.length());
      if (TextIO.floatMatcher.lookingAt()) {
         final String str = TextIO.floatMatcher.group();
         TextIO.pos = TextIO.floatMatcher.end();
         return str;
      }
      else 
         return null;
   }
   
   private static String readIntegerString() {  // read chars from input following syntax of integers
      TextIO.skipWhitespace();
      if (TextIO.lookChar() == TextIO.EOF)
         return null;
      if (TextIO.integerMatcher == null)
         TextIO.integerMatcher = TextIO.integerRegex.matcher(TextIO.buffer);
      TextIO.integerMatcher.region(TextIO.pos, TextIO.buffer.length());
      if (TextIO.integerMatcher.lookingAt()) {
         final String str = TextIO.integerMatcher.group();
         TextIO.pos = TextIO.integerMatcher.end();
         return str;
      }
      else 
         return null;
   }
   
   private static long readInteger(final long min, final long max) {  // read long integer, limited to specified range
      long x=0;
      while (true) {
         final String s = TextIO.readIntegerString();
         if (s == null){
            TextIO.errorMessage("Integer value not found in input.",
                  "Integer in the range " + min + " to " + max);
         }
         else {
            final String str = s;
            try { 
               x = Long.parseLong(str);
            }
            catch (final NumberFormatException e) {
               TextIO.errorMessage("Illegal integer input, " + str + ".",
                     "Integer in the range " + min + " to " + max);
               continue;
            }
            if (x < min || x > max) {
               TextIO.errorMessage("Integer input outside of legal range, " + str + ".",
                     "Integer in the range " + min + " to " + max);
               continue;
            }
            break;
         }
      }
      TextIO.inputErrorCount = 0;
      return x;
   }
   
   
   private static void errorMessage(final String message, final String expecting) {  // Report error on input.
      if (TextIO.readingStandardInput && TextIO.writingStandardOutput) {
             // inform user of error and force user to re-enter.
         TextIO.out.println();
         TextIO.out.print("  *** Error in input: " + message + "\n");
         TextIO.out.print("  *** Expecting: " + expecting + "\n");
         TextIO.out.print("  *** Discarding Input: ");
         if (TextIO.lookChar() == '\n')
            TextIO.out.print("(end-of-line)\n\n");
         else {
            while (TextIO.lookChar() != '\n')    // Discard and echo remaining chars on the current line of input.
               TextIO.out.print(TextIO.readChar());
            TextIO.out.print("\n\n");
         }
         TextIO.out.print("Please re-enter: ");
         TextIO.out.flush();
         TextIO.readChar();  // discard the end-of-line character
         TextIO.inputErrorCount++;
         if (TextIO.inputErrorCount >= 10)
            throw new IllegalArgumentException("Too many input consecutive input errors on standard input.");
      }
      else if (TextIO.inputFileName != null)
         throw new IllegalArgumentException("Error while reading from file \"" + TextIO.inputFileName + "\":\n"
               + message + "\nExpecting " + expecting);
      else
         throw new IllegalArgumentException("Error while reading from inptu stream:\n" 
               + message + "\nExpecting " + expecting);
   }
   
   private static char lookChar() {  // return next character from input
      if (TextIO.buffer == null || TextIO.pos > TextIO.buffer.length())
         TextIO.fillBuffer();
      if (TextIO.buffer == null)
         return TextIO.EOF;
      else if (TextIO.pos == TextIO.buffer.length())
         return '\n';
      else 
         return TextIO.buffer.charAt(TextIO.pos);
   }
   
   private static char readChar() {  // return and discard next character from input
      final char ch = TextIO.lookChar();
      if (TextIO.buffer == null) {
         if (TextIO.readingStandardInput)
            throw new IllegalArgumentException("Attempt to read past end-of-file in standard input???");
         else
            throw new IllegalArgumentException("Attempt to read past end-of-file in file \"" + TextIO.inputFileName + "\".");
      }
      TextIO.pos++;
      return ch;
   }
      
   private static void fillBuffer() {    // Wait for user to type a line and press return,
      try {
         TextIO.buffer = TextIO.in.readLine();
      }
      catch (final Exception e) {
         if (TextIO.readingStandardInput)
            throw new IllegalArgumentException("Error while reading standard input???");
         else if (TextIO.inputFileName != null)
            throw new IllegalArgumentException("Error while attempting to read from file \"" + TextIO.inputFileName + "\".");
         else
            throw new IllegalArgumentException("Errow while attempting to read form an input stream.");
      }
      TextIO.pos = 0;
      TextIO.floatMatcher = null;
      TextIO.integerMatcher = null;
   }
   
   private static void emptyBuffer() {   // discard the rest of the current line of input
      TextIO.buffer = null;
   }
   
   private static void outputError(final String message) {  // Report an error on output.
      if (TextIO.writingStandardOutput) {
        java.lang.System.err.println("Error occurred in TextIO while writing to standard output!!");
         TextIO.outputErrorCount++;
         if (TextIO.outputErrorCount >= 10) {
            TextIO.outputErrorCount = 0;
            throw new IllegalArgumentException("Too many errors while writing to standard output.");
         }
      }
      else if (TextIO.outputFileName != null){
         throw new IllegalArgumentException("Error occurred while writing to file \"" 
               + TextIO.outputFileName + "\":\n   " + message);
      }
      else {
         throw new IllegalArgumentException("Error occurred while writing to output stream:\n   " + message);
      }
   }
      
} // end of class TextIO
