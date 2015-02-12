using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using HighchartsMvcApplication.Models;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;

namespace HighchartsMvcApplication.Controllers
{

    [HandleError]
    public class AccountController : Controller
    {

        public IFormsAuthenticationService FormsService { get; set; }
        public IMembershipService MembershipService { get; set; }

        protected override void Initialize(RequestContext requestContext)
        {
            if (FormsService == null) { FormsService = new FormsAuthenticationService(); }
            if (MembershipService == null) { MembershipService = new AccountMembershipService(); }

            base.Initialize(requestContext);
        }

        // **************************************
        // URL: /Account/LogOn
        // **************************************

        public ActionResult LogOn()
        {
            return View();
        }

        [HttpPost]
        public ActionResult LogOn(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                if (MembershipService.ValidateUser(model.UserName, model.Password))
                {
                    FormsService.SignIn(model.UserName, model.RememberMe);
                    if (!String.IsNullOrEmpty(returnUrl))
                    {
                        return Redirect(returnUrl);
                    }
                    else
                    {
                        return RedirectToAction("Index", "Home");
                    }
                }
                else
                {
                    ModelState.AddModelError("", "The user name or password provided is incorrect.");
                }
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        // **************************************
        // URL: /Account/LogOff
        // **************************************

        public ActionResult LogOff()
        {
            FormsService.SignOut();

            return RedirectToAction("Index", "Home");
        }

        // **************************************
        // URL: /Account/Register
        // **************************************

        public ActionResult Register()
        {
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View();
        }

        [HttpPost]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                // Attempt to register the user
                MembershipCreateStatus createStatus = MembershipService.CreateUser(model.UserName, model.Password, model.Email);

                if (createStatus == MembershipCreateStatus.Success)
                {
                    FormsService.SignIn(model.UserName, false /* createPersistentCookie */);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", AccountValidation.ErrorCodeToString(createStatus));
                }
            }

            // If we got this far, something failed, redisplay form
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View(model);
        }

        // **************************************
        // URL: /Account/ChangePassword
        // **************************************

        [Authorize]
        public ActionResult ChangePassword()
        {
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View();
        }

        [Authorize]
        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                if (MembershipService.ChangePassword(User.Identity.Name, model.OldPassword, model.NewPassword))
                {
                    return RedirectToAction("ChangePasswordSuccess");
                }
                else
                {
                    ModelState.AddModelError("", "The current password is incorrect or the new password is invalid.");
                }
            }

            // If we got this far, something failed, redisplay form
            ViewData["PasswordLength"] = MembershipService.MinPasswordLength;
            return View(model);
        }

        // **************************************
        // URL: /Account/ChangePasswordSuccess
        // **************************************

        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        [HttpGet]
        public JsonResult Jsonp()
        {
            int[] data = new int[] { 23, 4, 34, 34, 54, 35, 34, 45, 34, 54, 35, 4, 35, 53, 35, 43 };
            return Json(data, JsonRequestBehavior.AllowGet);
        }

        public class App
        {
            public int appid;
            public string name;
            public DateTime stamp;
            public int tasks;
        }

        public static DateTime FromUnixtime(long unixTimeStamp)
        {
            // Unix timestamp is seconds past epoch
            System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
            dtDateTime = dtDateTime.AddMilliseconds(unixTimeStamp);
            return dtDateTime;
        }

        public class Series
        {
            public string name;
            public List<long> days;
            public List<decimal> values;
        }

        [HttpGet]
        public JsonResult app()
        {
            List<App> apps = new List<App>();

            Random rnd = new Random();

            for (int i = 0; i < 10; i++ )
            {
                string name = "app" + i;

                for (int j = 0; j < 30; j++)
                {
                    int tasks = rnd.Next(1000);
                    apps.Add(new App { appid = i, name = name, stamp = DateTime.Now.AddDays(-j), tasks = tasks });
                }
            }

            var groupedApps = (from a in apps
                     group a by a.appid into g
                     select new { AppId = g.Key, Items = g.ToList() }
                     ).ToList();


            List<Series> series = new List<Series>();

            foreach (var grApp in groupedApps)
            {
                Series s = new Series();
                s.values = new List<decimal>();
                s.days = new List<long>();
                s.name = "app" + grApp.AppId;

                Console.WriteLine(grApp.AppId);
                foreach (App app in grApp.Items.OrderBy(x => x.stamp))
                {
                    s.values.Add(app.tasks);
                    s.days.Add((long)((app.stamp - (new DateTime(1970, 1, 1))).TotalSeconds));
                }
                
                series.Add(s);
            }

            int k = 0;
            k = rnd.Next(series.Count);

            dynamic data = new
            {
                Name = series[k].name,
                Stamp = series[k].days,
                Tasks = series[k].values,
                Apps = series.Count
            };

            return Json(
                data
                //series
                , JsonRequestBehavior.AllowGet);
        }

        public class TempData
        {
            public string name;
            public int[] temterature;
        }

        [HttpGet]
        public JsonResult Temperature()
        {
            return Json(
                new
                {
                    time = new[] {
                        (long)((DateTime.Now.AddMonths(-11) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-10) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-9) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-8) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-7) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-6) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-5) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-4) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-3) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-2) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(-1) - (new DateTime(1970, 1, 1))).TotalSeconds),
                        (long)((DateTime.Now.AddMonths(0) - (new DateTime(1970, 1, 1))).TotalSeconds)
                    },
                    months = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" },
                    t = new
                    {
                        data1 = new { name = "Tokio", data = new double[] { 7, 6, 9, 14, 18, 21, 25, 26, 23, 18, 13, 9 } },
                        data2 = new { name = "New York", data = new double[] { -0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5 } },
                        data3 = new { name = "Berlin", data = new double[] { -0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0 } },
                        data4 = new { name = "London", data = new double[] { 3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8 } }
                    }
                }
                , JsonRequestBehavior.AllowGet);
        }
    }
}
