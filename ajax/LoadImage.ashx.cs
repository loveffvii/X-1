using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using model;
using System.IO;
using System.Drawing.Imaging;
using System.Drawing;
using System.Text;

namespace X_1.ajax
{
    /// <summary>
    /// LoadImage 的摘要说明
    /// </summary>
    public class LoadImage : IHttpHandler
    {
        public string rowInnerHtml = "";
        HttpContext Context;
        string json = "";

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentType = "text/plain";
            Context = context;
            loadimg();
            context.Response.Write(json);
        }
        private void loadimg()
        {
            PictureResolution pr = new PictureResolution();
            StringBuilder temphtml = new StringBuilder();
            //Bitmap bmp= pr.ReadImageFile(@"D:\picdome\1.jpg",out temphtml);

            System.Drawing.Image[] imarray = pr.SplitImage(@"D:\picdome\1.jpg", 31, 19, string.Empty, string.Empty, System.Drawing.Imaging.ImageFormat.Png, false);
            List<string> img64 = new List<string>();
            foreach (System.Drawing.Image im in imarray)
            {
                //byte[] imgbyte= pr.GetByteImage(im);
                // MemoryStream ms = new MemoryStream();
                // byte[] arr = new byte[imgbyte.Length];
                // ms.Position = 0;
                // ms.Read(arr, 0, (int)imgbyte.Length);
                // ms.Close();
                // string pic = Convert.ToBase64String(arr);
                img64.Add(pr.GetBase64String(im));
            }
            int countemp = 0;

            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append("{\"width\":"+ pr.WidthNumber + ",\"hight\":"+ pr.HeightNumber
                + ",  \"imglist\":[");
            for (int i = 0; i < img64.Count; i++)
            {
                //temphtml.Append("<tr>");
                //for (int j = 0; j < pr.WidthNumber; j++)
                //{
                //temphtml.Append("<td><image src=\"data:image/png;base64," + img64[countemp] + "\"/></td>");
                strBuilder.Append("{\"imgstring\":\"" + img64[i] + "\"},");
                //countemp++;
                //if (countemp >= img64.Count) break;
                //if (countemp >= 100) break;
                //}
                //temphtml.Append("</tr>");
            }
            //rowInnerHtml += temphtml.ToString();

            //foreach (APPLFSEvalProject _m in li)
            //{

            //}
            json = strBuilder.ToString().TrimEnd(',') + "]}";
            //MemoryStream ms = new MemoryStream();
            //bmp.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
            //Response.ContentType = "image/bmp";
            //Response.BinaryWrite(ms.ToArray());
            //rowInnerHtml = temphtml.ToString();
            //Color pixelColor = bmp.GetPixel(50, 50);
            //var s = pixelColor.Name;
        }
        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}